import uuid
import datetime
import io
import csv
import json
import os
import sys
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import Response, StreamingResponse
from typing import List, Dict, Any

from models.schemas import BenchmarkRequest, BenchmarkResponse, ModelResult
from utils.preprocessor import (
    preprocess_fair_data,
    get_available_datasets,
    DATASETS_DIR
)
from ml.classical_models import run_classical_suite
from quantum.quantum_pipeline import train_and_evaluate_quantum_model, QISKIT_AVAILABLE
from ml.comparison import generate_fair_comparison
from database.db import (
    save_experiment,
    get_all_experiments,
    get_experiment_by_id,
    delete_experiment_by_id
)

router = APIRouter(prefix="/api", tags=["Benchmark"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "python_version": sys.version,
        "qiskit_available": QISKIT_AVAILABLE,
        "quantum_engine": "Qiskit Statevector Simulator" if QISKIT_AVAILABLE else "Analytical Statevector Simulator (Fallback)"
    }

@router.get("/datasets/available")
def list_datasets():
    return get_available_datasets()

@router.post("/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    os.makedirs(DATASETS_DIR, exist_ok=True)
    file_path = os.path.join(DATASETS_DIR, file.filename)
    
    content = await file.read()
    try:
        # Validate readable CSV
        decoded = content.decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        header = next(reader)
        if len(header) < 2:
            raise ValueError("CSV must contain at least one feature column and one target column.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV structure: {str(e)}")

    with open(file_path, "wb") as f:
        f.write(content)
        
    return {
        "filename": file.filename,
        "message": f"Successfully uploaded {file.filename}",
        "columns": header
    }

@router.post("/benchmark/run", response_model=BenchmarkResponse)
def run_benchmark(request: BenchmarkRequest):
    exp_id = str(uuid.uuid4())
    now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # 1. Preprocess Dataset Fairly
    try:
        prep_data = preprocess_fair_data(
            dataset_name=request.dataset,
            test_size=request.test_size,
            random_seed=request.random_seed,
            n_qubits=request.n_qubits,
            use_pca=request.use_pca
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Preprocessing error: {str(e)}")

    results: List[Dict[str, Any]] = []

    # 2. Run Classical Models on Fair Preprocessed Data
    # To guarantee strict apples-to-apples parity, classical models receive the same reduced/PCA features
    # that are fed to the quantum circuit, ensuring 1:1 representational fairness.
    if request.classical_models:
        try:
            classical_results = run_classical_suite(
                selected_models=request.classical_models,
                X_train=prep_data["X_train_reduced"],
                y_train=prep_data["y_train"],
                X_test=prep_data["X_test_reduced"],
                y_test=prep_data["y_test"],
                random_seed=request.random_seed
            )
            results.extend(classical_results)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Classical training error: {str(e)}")

    # 3. Run Quantum VQC Model
    circuit_info = None
    if request.quantum_model == "vqc":
        try:
            q_res, circ_meta = train_and_evaluate_quantum_model(
                X_train_q=prep_data["X_train_quantum"],
                y_train=prep_data["y_train"],
                X_test_q=prep_data["X_test_quantum"],
                y_test=prep_data["y_test"],
                n_qubits=prep_data["reduced_features"],
                max_samples=request.max_quantum_samples or 70,
                random_seed=request.random_seed
            )
            results.append(q_res)
            circuit_info = circ_meta
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Quantum pipeline error: {str(e)}")

    # 4. Generate Objective Fair Comparison
    comparison = generate_fair_comparison(results, prep_data)

    # 5. Build Reproducibility Meta
    reproducibility = {
        "dataset": prep_data["dataset_name"],
        "random_seed": request.random_seed,
        "train_test_split": f"{int((1-request.test_size)*100)}/{int(request.test_size*100)}",
        "preprocessing": prep_data["preprocessing_method"],
        "quantum_backend": circuit_info["simulator"] if circuit_info else "N/A",
        "software_versions": {
            "Python": sys.version.split()[0],
            "Qiskit_Engine": "Enabled" if QISKIT_AVAILABLE else "Analytical_Fallback",
            "Optimizer": "COBYLA",
            "Scikit-Learn": "Enabled"
        },
        "timestamp": now_str
    }

    # 6. Assemble Full Response
    response_data = {
        "id": exp_id,
        "timestamp": now_str,
        "dataset_info": {
            "name": prep_data["dataset_name"],
            "total_samples": prep_data["total_samples"],
            "n_features": prep_data["original_n_features"],
            "n_classes": prep_data["n_classes"],
            "classes": prep_data["classes"],
            "train_samples": prep_data["train_samples"],
            "test_samples": prep_data["test_samples"],
            "preprocessing_method": prep_data["preprocessing_method"],
            "random_seed": prep_data["random_seed"],
            "reduction_applied": prep_data["reduction_applied"],
            "reduced_features": prep_data["reduced_features"]
        },
        "quantum_circuit_info": circuit_info,
        "results": results,
        "comparison": comparison,
        "reproducibility": reproducibility
    }

    # 7. Persist to SQLite Database
    try:
        save_experiment(response_data)
    except Exception as e:
        print(f"[Q-Bench] DB Save error: {e}")

    return response_data

@router.get("/experiments")
def get_experiments():
    return get_all_experiments()

@router.get("/experiments/{exp_id}")
def get_experiment(exp_id: str):
    exp = get_experiment_by_id(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found.")
    return exp

@router.delete("/experiments/{exp_id}")
def delete_experiment(exp_id: str):
    success = delete_experiment_by_id(exp_id)
    if not success:
        raise HTTPException(status_code=404, detail="Experiment not found or already deleted.")
    return {"message": "Experiment deleted successfully", "id": exp_id}

@router.get("/export/csv/{exp_id}")
def export_csv(exp_id: str):
    exp = get_experiment_by_id(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found.")
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Metadata headers
    writer.writerow(["Q-Bench Benchmark Experiment Report"])
    writer.writerow(["Experiment ID", exp["id"]])
    writer.writerow(["Timestamp", exp["timestamp"]])
    writer.writerow(["Dataset", exp["dataset_info"]["name"]])
    writer.writerow(["Train Samples", exp["dataset_info"]["train_samples"]])
    writer.writerow(["Test Samples", exp["dataset_info"]["test_samples"]])
    writer.writerow(["Preprocessing", exp["dataset_info"]["preprocessing_method"]])
    writer.writerow(["Random Seed", exp["dataset_info"]["random_seed"]])
    writer.writerow([])
    
    # Table headers
    writer.writerow(["Model", "Type", "Accuracy", "Precision", "Recall", "F1 Score", "Training Time (s)", "Inference Time (s)"])
    for r in exp["results"]:
        writer.writerow([
            r["model_name"],
            r["model_type"],
            r["accuracy"],
            r["precision"],
            r["recall"],
            r["f1_score"],
            r["train_time_sec"],
            r["inference_time_sec"]
        ])
        
    writer.writerow([])
    writer.writerow(["Fair Comparison Summary"])
    comp = exp.get("comparison", {})
    writer.writerow(["Best Accuracy", f"{comp.get('best_accuracy_model')} ({comp.get('best_accuracy_val')})"])
    writer.writerow(["Best F1 Score", f"{comp.get('best_f1_model')} ({comp.get('best_f1_val')})"])
    writer.writerow(["Fastest Training", f"{comp.get('fastest_train_model')} ({comp.get('fastest_train_sec')}s)"])
    writer.writerow(["Fastest Inference", f"{comp.get('fastest_inference_model')} ({comp.get('fastest_inference_sec')}s)"])
    writer.writerow(["Scientific Analysis", comp.get("quantum_vs_classical_analysis")])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=qbench_experiment_{exp_id[:8]}.csv"}
    )

@router.get("/export/json/{exp_id}")
def export_json(exp_id: str):
    exp = get_experiment_by_id(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found.")
        
    return Response(
        content=json.dumps(exp, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=qbench_experiment_{exp_id[:8]}.json"}
    )

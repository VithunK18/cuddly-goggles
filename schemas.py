from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class BenchmarkRequest(BaseModel):
    dataset: str = Field(default="iris", description="Dataset name or uploaded filename: iris, breast_cancer, wine, digits, custom")
    test_size: float = Field(default=0.2, description="Test split proportion (e.g., 0.2, 0.25, 0.3)")
    random_seed: int = Field(default=42, description="Random seed for reproducibility")
    classical_models: List[str] = Field(
        default=["logistic_regression", "svm", "random_forest"],
        description="List of classical models to benchmark"
    )
    quantum_model: str = Field(default="vqc", description="Quantum ML model, e.g., 'vqc'")
    n_qubits: int = Field(default=4, ge=2, le=8, description="Number of qubits / features for quantum circuit")
    use_pca: bool = Field(default=True, description="Whether to apply PCA dimensionality reduction")
    max_quantum_samples: Optional[int] = Field(default=80, description="Max samples for quantum training for interactive responsiveness")

class ModelResult(BaseModel):
    model_name: str
    model_type: str  # "Classical" or "Quantum"
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    train_time_sec: float
    inference_time_sec: float
    details: Dict[str, Any] = {}

class QuantumCircuitInfo(BaseModel):
    qubit_count: int
    circuit_depth: int
    gate_count: Dict[str, int]
    feature_map: str
    ansatz: str
    simulator: str
    circuit_diagram_text: str

class DatasetInfo(BaseModel):
    name: str
    total_samples: int
    n_features: int
    n_classes: int
    classes: List[str]
    train_samples: int
    test_samples: int
    preprocessing_method: str
    random_seed: int
    reduction_applied: bool
    reduced_features: int

class ComparisonSummary(BaseModel):
    best_accuracy_model: str
    best_accuracy_val: float
    best_f1_model: str
    best_f1_val: float
    fastest_train_model: str
    fastest_train_sec: float
    fastest_inference_model: str
    fastest_inference_sec: float
    quantum_vs_classical_analysis: str
    key_findings: List[str]

class ReproducibilityInfo(BaseModel):
    dataset: str
    random_seed: int
    train_test_split: str
    preprocessing: str
    quantum_backend: str
    software_versions: Dict[str, str]
    timestamp: str

class BenchmarkResponse(BaseModel):
    id: str
    timestamp: str
    dataset_info: DatasetInfo
    quantum_circuit_info: Optional[QuantumCircuitInfo] = None
    results: List[ModelResult]
    comparison: ComparisonSummary
    reproducibility: ReproducibilityInfo

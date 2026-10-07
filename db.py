import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "qbench.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS experiments (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        dataset_name TEXT NOT NULL,
        train_samples INTEGER NOT NULL,
        test_samples INTEGER NOT NULL,
        n_features INTEGER NOT NULL,
        n_classes INTEGER NOT NULL,
        random_seed INTEGER NOT NULL,
        test_size REAL NOT NULL,
        models_evaluated TEXT NOT NULL,
        best_accuracy_model TEXT NOT NULL,
        best_f1_model TEXT NOT NULL,
        fastest_train_model TEXT NOT NULL,
        fastest_inference_model TEXT NOT NULL,
        full_results_json TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

def save_experiment(experiment_data: Dict[str, Any]):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    
    models_evaluated = [m["model_name"] for m in experiment_data.get("results", [])]
    comp = experiment_data.get("comparison", {})
    ds = experiment_data.get("dataset_info", {})
    
    cursor.execute("""
    INSERT INTO experiments (
        id, timestamp, dataset_name, train_samples, test_samples,
        n_features, n_classes, random_seed, test_size,
        models_evaluated, best_accuracy_model, best_f1_model,
        fastest_train_model, fastest_inference_model, full_results_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        experiment_data["id"],
        experiment_data["timestamp"],
        ds.get("name", "Unknown"),
        ds.get("train_samples", 0),
        ds.get("test_samples", 0),
        ds.get("n_features", 0),
        ds.get("n_classes", 0),
        ds.get("random_seed", 42),
        ds.get("test_size", 0.2),
        json.dumps(models_evaluated),
        comp.get("best_accuracy_model", "N/A"),
        comp.get("best_f1_model", "N/A"),
        comp.get("fastest_train_model", "N/A"),
        comp.get("fastest_inference_model", "N/A"),
        json.dumps(experiment_data)
    ))
    conn.commit()
    conn.close()

def get_all_experiments() -> List[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM experiments ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "dataset_name": r["dataset_name"],
            "train_samples": r["train_samples"],
            "test_samples": r["test_samples"],
            "n_features": r["n_features"],
            "n_classes": r["n_classes"],
            "random_seed": r["random_seed"],
            "test_size": r["test_size"],
            "models_evaluated": json.loads(r["models_evaluated"]),
            "best_accuracy_model": r["best_accuracy_model"],
            "best_f1_model": r["best_f1_model"],
            "fastest_train_model": r["fastest_train_model"],
            "fastest_inference_model": r["fastest_inference_model"],
            "full_results": json.loads(r["full_results_json"])
        })
    conn.close()
    return results

def get_experiment_by_id(exp_id: str) -> Optional[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT full_results_json FROM experiments WHERE id = ?", (exp_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["full_results_json"])
    return None

def delete_experiment_by_id(exp_id: str) -> bool:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM experiments WHERE id = ?", (exp_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

import time
from typing import Dict, Any, List
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def train_and_evaluate_model(
    model_key: str,
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    random_seed: int = 42
) -> Dict[str, Any]:
    """
    Trains a classical ML model and records metrics and timing with microsecond precision.
    """
    model_name_map = {
        "logistic_regression": "Logistic Regression",
        "svm": "Support Vector Machine (SVM)",
        "random_forest": "Random Forest Classifier"
    }
    
    display_name = model_name_map.get(model_key, model_key.replace("_", " ").title())
    
    if model_key == "logistic_regression":
        clf = LogisticRegression(max_iter=1000, random_state=random_seed)
        params = {"solver": "lbfgs", "max_iter": 1000, "C": 1.0}
    elif model_key == "svm":
        clf = SVC(random_state=random_seed)
        params = {"kernel": "rbf", "C": 1.0, "gamma": "scale"}
    elif model_key == "random_forest":
        clf = RandomForestClassifier(n_estimators=100, random_state=random_seed)
        params = {"n_estimators": 100, "criterion": "gini"}
    else:
        raise ValueError(f"Unsupported classical model: {model_key}")
        
    # Measure Training Time
    t_train_start = time.perf_counter()
    clf.fit(X_train, y_train)
    t_train_end = time.perf_counter()
    train_time = round(t_train_end - t_train_start, 6)
    
    # Measure Inference Time
    t_infer_start = time.perf_counter()
    y_pred = clf.predict(X_test)
    t_infer_end = time.perf_counter()
    inference_time = round(t_infer_end - t_infer_start, 6)
    
    # Calculate Evaluation Metrics
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
    rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))
    
    return {
        "model_name": display_name,
        "model_type": "Classical",
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "train_time_sec": train_time,
        "inference_time_sec": inference_time,
        "details": {
            "hyperparameters": params,
            "feature_dimension": X_train.shape[1],
            "train_samples": len(y_train),
            "test_samples": len(y_test)
        }
    }

def run_classical_suite(
    selected_models: List[str],
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    random_seed: int = 42
) -> List[Dict[str, Any]]:
    """
    Runs all selected classical models on the exact same dataset split and features.
    """
    results = []
    for model_key in selected_models:
        res = train_and_evaluate_model(
            model_key=model_key,
            X_train=X_train,
            y_train=y_train,
            X_test=X_test,
            y_test=y_test,
            random_seed=random_seed
        )
        results.append(res)
    return results

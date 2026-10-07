import os
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any, Optional
from sklearn.datasets import load_iris, load_breast_cancer, load_wine, load_digits
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.decomposition import PCA

DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")

def get_available_datasets() -> list:
    built_in = [
        {"id": "iris", "name": "Iris Flower Dataset", "description": "150 samples, 4 features, 3 classes (Sepal/Petal dimensions)"},
        {"id": "breast_cancer", "name": "Breast Cancer Wisconsin", "description": "569 samples, 30 features, 2 classes (Malignant/Benign)"},
        {"id": "wine", "name": "Wine Recognition", "description": "178 samples, 13 features, 3 cultivars"},
        {"id": "digits", "name": "Optical Recognition of Handwritten Digits (Subset)", "description": "360 samples (Digits 0 & 1), 64 features, 2 classes"}
    ]
    custom_datasets = []
    if os.path.exists(DATASETS_DIR):
        for f in os.listdir(DATASETS_DIR):
            if f.endswith(".csv"):
                custom_datasets.append({
                    "id": f,
                    "name": f"Uploaded: {f}",
                    "description": f"Custom dataset file {f}"
                })
    return built_in + custom_datasets

def load_raw_dataset(dataset_name: str) -> Tuple[np.ndarray, np.ndarray, list, list]:
    """
    Returns (X, y, feature_names, target_names)
    """
    if dataset_name == "iris":
        data = load_iris()
        return data.data, data.target, list(data.feature_names), list(data.target_names)
    
    elif dataset_name == "breast_cancer":
        data = load_breast_cancer()
        return data.data, data.target, list(data.feature_names), list(data.target_names)
    
    elif dataset_name == "wine":
        data = load_wine()
        return data.data, data.target, list(data.feature_names), list(data.target_names)
    
    elif dataset_name == "digits":
        # Load binary subset (0 vs 1) for fast and clear quantum demonstration
        data = load_digits()
        mask = (data.target == 0) | (data.target == 1)
        X = data.data[mask]
        y = data.target[mask]
        return X, y, [f"pixel_{i}" for i in range(X.shape[1])], ["digit_0", "digit_1"]
    
    else:
        # Check custom CSV file in DATASETS_DIR
        file_path = os.path.join(DATASETS_DIR, dataset_name)
        if not os.path.exists(file_path):
            # check directly
            file_path = dataset_name
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Dataset '{dataset_name}' not found.")
        
        df = pd.read_csv(file_path)
        if df.empty:
            raise ValueError("Uploaded CSV is empty.")
        
        # Last column is assumed to be target unless specified
        target_col = df.columns[-1]
        feature_cols = df.columns[:-1]
        
        X_df = df[feature_cols]
        y_series = df[target_col]
        
        # Convert non-numeric feature columns or impute
        X_df = X_df.select_dtypes(include=[np.number])
        if X_df.shape[1] == 0:
            raise ValueError("No numeric feature columns found in dataset.")
        
        # Impute missing values in X
        imputer = SimpleImputer(strategy='mean')
        X = imputer.fit_transform(X_df)
        
        # Encode target
        le = LabelEncoder()
        y = le.fit_transform(y_series.astype(str))
        
        return X, y, list(X_df.columns), [str(c) for c in le.classes_]

def preprocess_fair_data(
    dataset_name: str,
    test_size: float = 0.2,
    random_seed: int = 42,
    n_qubits: int = 4,
    use_pca: bool = True
) -> Dict[str, Any]:
    """
    Standardized Preprocessing Pipeline:
    Same Dataset + Same Imputation + Same Train/Test Split + Same Scaling + Same PCA for QML.
    """
    X_raw, y_raw, feature_names, target_names = load_raw_dataset(dataset_name)
    
    total_samples, original_n_features = X_raw.shape
    n_classes = len(np.unique(y_raw))
    
    # Stratified train/test split with exact random seed
    try:
        X_train_raw, X_test_raw, y_train, y_test = train_test_split(
            X_raw, y_raw,
            test_size=test_size,
            random_state=random_seed,
            stratify=y_raw
        )
    except Exception:
        # Fallback if a class has only 1 sample
        X_train_raw, X_test_raw, y_train, y_test = train_test_split(
            X_raw, y_raw,
            test_size=test_size,
            random_state=random_seed
        )
        
    # Standard scaling fitted exclusively on training set to avoid data leakage
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_raw)
    X_test_scaled = scaler.transform(X_test_raw)
    
    # PCA Dimensionality Reduction
    reduction_applied = False
    reduced_features = original_n_features
    pca_model = None
    
    if (use_pca or original_n_features > n_qubits) and original_n_features > n_qubits:
        target_dim = min(n_qubits, original_n_features, X_train_scaled.shape[0])
        pca = PCA(n_components=target_dim, random_state=random_seed)
        X_train_reduced = pca.fit_transform(X_train_scaled)
        X_test_reduced = pca.transform(X_test_scaled)
        reduction_applied = True
        reduced_features = target_dim
        pca_model = pca
    else:
        # If already <= n_qubits, use scaled directly or trim to n_qubits if needed
        if original_n_features > n_qubits:
            X_train_reduced = X_train_scaled[:, :n_qubits]
            X_test_reduced = X_test_scaled[:, :n_qubits]
            reduced_features = n_qubits
            reduction_applied = True
        else:
            X_train_reduced = X_train_scaled
            X_test_reduced = X_test_scaled
            reduced_features = original_n_features

    # For Quantum Feature Mapping, angles in [0, pi] or [-pi, pi] work best:
    # Scale reduced features to [-np.pi, np.pi] for ZZFeatureMap encoding
    q_scale = np.max(np.abs(X_train_reduced))
    if q_scale > 0:
        X_train_q = (X_train_reduced / q_scale) * np.pi
        X_test_q = (X_test_reduced / q_scale) * np.pi
    else:
        X_train_q = X_train_reduced
        X_test_q = X_test_reduced

    return {
        "dataset_name": dataset_name,
        "total_samples": total_samples,
        "original_n_features": original_n_features,
        "n_classes": n_classes,
        "classes": [str(c) for c in target_names],
        "train_samples": len(y_train),
        "test_samples": len(y_test),
        "random_seed": random_seed,
        "test_size": test_size,
        "reduction_applied": reduction_applied,
        "reduced_features": reduced_features,
        "preprocessing_method": f"StandardScaler + {'PCA (' + str(reduced_features) + ' components)' if reduction_applied else 'Direct'}",
        # Datasets
        "X_train_scaled": X_train_scaled,
        "X_test_scaled": X_test_scaled,
        "X_train_reduced": X_train_reduced,
        "X_test_reduced": X_test_reduced,
        "X_train_quantum": X_train_q,
        "X_test_quantum": X_test_q,
        "y_train": y_train,
        "y_test": y_test,
        "pca_explained_variance_ratio": pca_model.explained_variance_ratio_.tolist() if pca_model else []
    }

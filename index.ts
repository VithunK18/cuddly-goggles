export interface DatasetInfo {
  name: string;
  total_samples: number;
  n_features: number;
  n_classes: number;
  classes: string[];
  train_samples: number;
  test_samples: number;
  preprocessing_method: string;
  random_seed: number;
  reduction_applied: boolean;
  reduced_features: number;
}

export interface ModelResult {
  model_name: string;
  model_type: 'Quantum' | 'Classical';
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  train_time_sec: number;
  inference_time_sec: number;
  details?: Record<string, any>;
}

export interface QuantumCircuitInfo {
  qubit_count: number;
  circuit_depth: number;
  gate_count: Record<string, number>;
  feature_map: string;
  ansatz: string;
  simulator: string;
  circuit_diagram_text: string;
}

export interface ComparisonSummary {
  best_accuracy_model: string;
  best_accuracy_val: number;
  best_f1_model: string;
  best_f1_val: number;
  fastest_train_model: string;
  fastest_train_sec: number;
  fastest_inference_model: string;
  fastest_inference_sec: number;
  quantum_vs_classical_analysis: string;
  key_findings: string[];
}

export interface ReproducibilityInfo {
  dataset: string;
  random_seed: number;
  train_test_split: string;
  preprocessing: string;
  quantum_backend: string;
  software_versions: Record<string, string>;
  timestamp: string;
}

export interface BenchmarkResponse {
  id: string;
  timestamp: string;
  dataset_info: DatasetInfo;
  quantum_circuit_info?: QuantumCircuitInfo;
  results: ModelResult[];
  comparison: ComparisonSummary;
  reproducibility: ReproducibilityInfo;
}

export interface BenchmarkRequest {
  dataset: string;
  test_size: number;
  random_seed: number;
  classical_models: string[];
  quantum_model: string;
  n_qubits: number;
  use_pca: boolean;
  max_quantum_samples?: number;
}

export interface ExperimentSummary {
  id: string;
  timestamp: string;
  dataset_name: string;
  train_samples: number;
  test_samples: number;
  n_features: number;
  n_classes: number;
  random_seed: number;
  test_size: number;
  models_evaluated: string[];
  best_accuracy_model: string;
  best_f1_model: string;
  fastest_train_model: string;
  fastest_inference_model: string;
  full_results: BenchmarkResponse;
}

export interface DatasetOption {
  id: string;
  name: string;
  description: string;
}

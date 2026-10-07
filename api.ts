import type { BenchmarkRequest, BenchmarkResponse, ExperimentSummary, DatasetOption } from '../types';

const API_BASE = '/api';

export async function getHealth(): Promise<{
  status: string;
  python_version: string;
  qiskit_available: boolean;
  quantum_engine: string;
}> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function getAvailableDatasets(): Promise<DatasetOption[]> {
  const res = await fetch(`${API_BASE}/datasets/available`);
  if (!res.ok) throw new Error('Failed to fetch available datasets');
  return res.json();
}

export async function uploadDataset(file: File): Promise<{
  filename: string;
  message: string;
  columns: string[];
}> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/dataset/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Dataset upload failed');
  }
  return res.json();
}

export async function runBenchmark(request: BenchmarkRequest): Promise<BenchmarkResponse> {
  const res = await fetch(`${API_BASE}/benchmark/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Benchmark execution failed');
  }
  return res.json();
}

export async function getExperiments(): Promise<ExperimentSummary[]> {
  const res = await fetch(`${API_BASE}/experiments`);
  if (!res.ok) throw new Error('Failed to retrieve experiment history');
  return res.json();
}

export async function getExperiment(id: string): Promise<BenchmarkResponse> {
  const res = await fetch(`${API_BASE}/experiments/${id}`);
  if (!res.ok) throw new Error('Failed to retrieve experiment details');
  return res.json();
}

export async function deleteExperiment(id: string): Promise<{ message: string; id: string }> {
  const res = await fetch(`${API_BASE}/experiments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete experiment');
  return res.json();
}

export function getExportCsvUrl(id: string): string {
  return `${API_BASE}/export/csv/${id}`;
}

export function getExportJsonUrl(id: string): string {
  return `${API_BASE}/export/json/${id}`;
}

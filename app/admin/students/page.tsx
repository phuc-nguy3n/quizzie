"use client";
import { useState, useEffect, useCallback } from "react";
import { StudentForm } from "./components/StudentForm";
import { Student } from "./types";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(
    undefined,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.append("search", searchTerm);

      const res = await fetch(`/admin/students/api?${query.toString()}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      setStudents(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = async (studentData: unknown) => {
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      await res.json();
      fetchStudents();
      setShowForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleEditStudent = async (studentData: Student) => {
    try {
      const res = await fetch("/api/admin/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      await res.json();
      fetchStudents();
      setShowForm(false);
      setEditingStudent(undefined);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa học viên này không?")) return;
    try {
      const res = await fetch("/api/admin/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      fetchStudents();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý học viên</h1>

      {error && <div className="text-red-500 mb-4">Lỗi: {error}</div>}

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md"
          />
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingStudent(undefined);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Thêm học viên mới
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? "Chỉnh sửa học viên" : "Thêm học viên"}
            </h2>
            <StudentForm
              initialData={editingStudent}
              onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
              onCancel={() => {
                setShowForm(false);
                setEditingStudent(undefined);
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div>Đang tải học viên...</div>
      ) : students.length === 0 ? (
        <div>Không có học viên nào.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Tên</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Ngày sinh</th>
              <th className="py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="py-2 px-4 border-b">{student.name}</td>
                <td className="py-2 px-4 border-b">{student.email}</td>
                <td className="py-2 px-4 border-b">{student.dob}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => {
                      setEditingStudent(student);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

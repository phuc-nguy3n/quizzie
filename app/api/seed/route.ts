import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Thêm dữ liệu vào bảng students
    const { data: students, error: studentError } = await supabase
      .from("students")
      .insert([
        { name: "Nguyen Van A", email: "vana@example.com", dob: "2000-01-15" },
        { name: "Tran Thi B", email: "thib@example.com", dob: "1999-05-20" },
        { name: "Le Van C", email: "vanc@example.com", dob: "2001-11-10" },
      ])
      .select();

    if (studentError) throw studentError;
    console.log("Students seeded:", students);

    // 2. Thêm dữ liệu vào bảng courses
    const { data: courses, error: courseError } = await supabase
      .from("courses")
      .insert([
        {
          name: "Toán Cao Cấp",
          description: "Môn học về giải tích và đại số tuyến tính",
        },
        {
          name: "Lập trình Web",
          description: "Giới thiệu về phát triển web frontend và backend",
        },
        {
          name: "Cơ sở dữ liệu",
          description: "Tìm hiểu về thiết kế và quản lý cơ sở dữ liệu",
        },
      ])
      .select();

    if (courseError) throw courseError;
    console.log("Courses seeded:", courses);

    // 3. Liên kết học viên với khóa học và thêm điểm vào bảng student_courses
    if (students && courses) {
      const studentCoursesData = [
        { student_id: students[0].id, course_id: courses[0].id, score: 85 },
        { student_id: students[0].id, course_id: courses[1].id, score: 92 },
        { student_id: students[1].id, course_id: courses[0].id, score: 78 },
        { student_id: students[2].id, course_id: courses[2].id, score: 88 },
      ];

      const { data: studentCourses, error: scError } = await supabase
        .from("student_courses")
        .insert(studentCoursesData)
        .select();

      if (scError) throw scError;
      console.log("Student Courses seeded:", studentCourses);
    }

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error seeding database:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error seeding database:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}

// API routes for student management

import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  let query = supabase.from("students").select("*");

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: students, error } = await query;

  if (error) {
    console.error("Error fetching students:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const { name, email, dob } = await request.json();

  const { data: newStudent, error } = await supabase
    .from("students")
    .insert([{ name, email, dob }])
    .select()
    .single();

  if (error) {
    console.error("Error adding student:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(newStudent, { status: 201 });
}

export async function PUT(request: Request) {
  const { id, name, email, dob } = await request.json();

  const { data: updatedStudent, error } = await supabase
    .from("students")
    .update({ name, email, dob })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating student:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!updatedStudent) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(updatedStudent);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    console.error("Error deleting student:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Student deleted successfully" });
}

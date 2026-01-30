import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'schedules.json');

export interface Schedule {
  id: string;
  date: string; // ISO format
  description: string;
  createdAt: string;
}

// GET - Fetch all scheduled dates
export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const schedules: Schedule[] = JSON.parse(data);
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Add new scheduled date
export async function POST(request: Request) {
  try {
    const { date, description } = await request.json();
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    if (new Date(date) < new Date()) {
        return NextResponse.json({ error: 'Date must be in the future' }, { status: 400 });
    }

    if (!description || description.trim() === '') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    // Read existing schedules
    let schedules: Schedule[] = [];
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      schedules = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty array
    }

    // Check if date already scheduled
    const dateOnly = new Date(date).toISOString().split('T')[0];
    const exists = schedules.some(s => s.date.split('T')[0] === dateOnly);
    
    if (exists) {
      return NextResponse.json({ error: 'Date already scheduled' }, { status: 409 });
    }

    // Add new schedule
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      date: new Date(date).toISOString(),
      description: description.trim(),
      createdAt: new Date().toISOString()
    };

    schedules.push(newSchedule);
    await fs.writeFile(DATA_FILE, JSON.stringify(schedules, null, 2));

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Schedule } from '../route';

const DATA_FILE = path.join(process.cwd(), 'data', 'schedules.json');

// DELETE - Remove a scheduled date
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Read existing schedules
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let schedules: Schedule[] = JSON.parse(data);

    // Filter out the schedule to delete
    const filtered = schedules.filter(s => s.id !== id);

    if (filtered.length === schedules.length) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
  }
}

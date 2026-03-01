// THIS IS A SAMPLE GET REQUEST (you can remove and modify)

import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { Plant } from '@/types';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    const plants = await db.findMany(location ? { location } : undefined);

    return NextResponse.json(
        {
            data: plants,
            message: "Plants retrieved successfully",
        }
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name || !body.species || !body.location) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const newPlant = await db.create({
            name: body.name,
            species: body.species,
            location: body.location,
            lastWatered: new Date(),
            status: 'Healthy'
        });

        return NextResponse.json({ data: newPlant }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid Request'}, { status: 400 });
    }
}
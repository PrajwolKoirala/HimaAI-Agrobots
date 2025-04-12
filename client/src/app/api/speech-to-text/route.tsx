// app/api/speech-to-text/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SpeechClient } from '@google-cloud/speech';

// Initialize Speech client
// You'll need to set up Google Cloud credentials
const speechClient = new SpeechClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en';
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }
    
    // Convert language code
    const languageCode = language === 'ne' ? 'ne-NP' : 'en-US';
    
    // Save the file temporarily
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const filename = `speech-${uuidv4()}.webm`;
    const filepath = path.join(process.cwd(), 'tmp', filename);
    
    // Ensure the directory exists
    await writeFile(filepath, buffer);
    
    // Perform speech recognition
    const [response] = await speechClient.recognize({
      audio: {
        content: buffer.toString('base64'),
      },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode,
      },
    });
    
    // Extract the transcription
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join(' ') || '';
    
    // Delete the temporary file (cleanup)
    // Omitted for simplicity, but should be implemented in production
    
    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json(
      { error: 'Failed to process speech' },
      { status: 500 }
    );
  }
}
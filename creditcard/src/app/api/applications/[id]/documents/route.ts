import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log('=== API ROUTE: /api/applications/[id]/documents ===');
  
  try {
    const params = await context.params;
    const applicationId = params.id;
    console.log('Application ID:', applicationId);

    const dataFolder = path.join(process.cwd(), 'data');
    const databaseFile = path.join(dataFolder, 'applications.json');
    
    console.log('Reading database from:', databaseFile);

    let applicantName = 'Unknown';
    
    if (existsSync(databaseFile)) {
      try {
        const fileContent = readFileSync(databaseFile, 'utf-8');
        console.log('File content length:', fileContent.length);
        
        const database = JSON.parse(fileContent);
        console.log('Database parsed successfully');
        console.log('Total applications:', database.applications?.length);
        
        const application = database.applications?.find(
          (app: any) => app.id === parseInt(applicationId)
        );
        
        if (application) {
          applicantName = `${application.firstName}_${application.lastName}`;
          console.log('Found applicant:', applicantName);
        } else {
          console.warn('Application not found for ID:', applicationId);
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
      }
    } else {
      console.error('Database file does not exist:', databaseFile);
    }

    const formData = await request.formData();
    const salaryCertificate = formData.get('salaryCertificate') as File;
    const nationalId = formData.get('nationalId') as File;

    console.log('Files received:');
    console.log('- Salary certificate:', salaryCertificate?.name);
    console.log('- National ID:', nationalId?.name);

    if (!salaryCertificate || !nationalId) {
      console.error('Missing files!');
      return NextResponse.json(
        { success: false, error: 'Both files are required' },
        { status: 400 }
      );
    }

    const uploadsFolder = path.join(process.cwd(), 'uploads');
    console.log('Uploads folder:', uploadsFolder);
    
    if (!existsSync(uploadsFolder)) {
      console.log('Creating uploads folder...');
      await mkdir(uploadsFolder, { recursive: true });
    }

    const applicantFolder = path.join(uploadsFolder, `${applicationId}_${applicantName}`);
    console.log('Applicant folder:', applicantFolder);
    
    console.log('Creating applicant folder...');
    await mkdir(applicantFolder, { recursive: true });

    const salaryExt = salaryCertificate.name.split('.').pop() || 'pdf';
    const salaryBytes = await salaryCertificate.arrayBuffer();
    const salaryBuffer = Buffer.from(salaryBytes);
    const salaryFileName = `salary_certificate.${salaryExt}`;
    const salaryPath = path.join(applicantFolder, salaryFileName);
    
    console.log('Saving salary certificate to:', salaryPath);
    await writeFile(salaryPath, salaryBuffer);
    console.log('✓ Salary certificate saved');

    const idExt = nationalId.name.split('.').pop() || 'pdf';
    const idBytes = await nationalId.arrayBuffer();
    const idBuffer = Buffer.from(idBytes);
    const idFileName = `national_id.${idExt}`;
    const idPath = path.join(applicantFolder, idFileName);
    
    console.log('Saving national ID to:', idPath);
    await writeFile(idPath, idBuffer);
    console.log('✓ National ID saved');

    console.log('✓ All files saved successfully!');

    return NextResponse.json({
      success: true,
      message: 'Documents uploaded successfully',
      folder: `${applicationId}_${applicantName}`,
    });

  } catch (error) {
    console.error('ERROR in /api/applications/[id]/documents:');
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload documents',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
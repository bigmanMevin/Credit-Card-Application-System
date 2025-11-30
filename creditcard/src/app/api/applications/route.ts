import { NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(request) {
  console.log('received application submission');
  
  try {
    // get the data from request body
    const applicationData = await request.json();
    console.log('application data:', applicationData);
    
    // check if data folder exists, if not create it
    const dataFolder = path.join(process.cwd(), 'data');
    if (!existsSync(dataFolder)) {
      console.log('creating data folder...');
      mkdirSync(dataFolder);
    }
    
    const databaseFile = path.join(dataFolder, 'applications.json');
    
    // initialize variables
    let allApplications = [];
    let nextApplicationId = 1;
    
    // check if database file exists
    if (existsSync(databaseFile)) {
      // read existing data
      const fileContent = readFileSync(databaseFile, 'utf-8');
      const database = JSON.parse(fileContent);
      allApplications = database.applications || [];
      nextApplicationId = database.nextId || 1;
    }
    
    // create the new application object
    const newApp = {
      id: nextApplicationId,
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      email: applicationData.email,
      phone: applicationData.phone,
      employmentType: applicationData.employmentType,
      companyName: applicationData.companyName || null,
      salary: applicationData.salary || null,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    
    // add to applications array
    allApplications.push(newApp);
    console.log('added new application with id:', nextApplicationId);
    
    // prepare data to save
    const dataToSave = {
      applications: allApplications,
      nextId: nextApplicationId + 1,
    };
    
    // write back to file
    writeFileSync(databaseFile, JSON.stringify(dataToSave, null, 2));
    console.log('saved to database');
    
    // send success response
    return NextResponse.json({ 
      success: true, 
      id: nextApplicationId,
      message: 'Application saved successfully' 
    });
    
  } catch (error) {
    console.error('error saving application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save application' }, 
      { status: 500 }
    );
  }
}

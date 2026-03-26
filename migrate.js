const { createClient } = require("@supabase/supabase-js");
const { readFile } = require("fs/promises");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  try {
    console.log("Reading local JSON file...");
    const fileContent = await readFile(
      "./assets/eth_all_departments.json",
      "utf-8",
    );
    const ethData = JSON.parse(fileContent);

    const departmentCodes = Object.keys(ethData);
    console.log(`Found ${departmentCodes.length} departments. Syncing...`);

    const deptRecords = departmentCodes.map((code) => ({ code: code }));

    const { data: insertedDepts, error: deptError } = await supabase
      .from("departments")
      .upsert(deptRecords, { onConflict: "code" })
      .select();

    if (deptError) throw deptError;

    const deptMap = {};
    insertedDepts.forEach((d) => {
      deptMap[d.code] = d.uid;
    });

    let allProfessors = [];

    for (const [departmentCode, deptData] of Object.entries(ethData)) {
      if (!deptData.data) continue;

      const department_uid = deptMap[departmentCode];

      const mappedStaff = deptData.data.map((person) => ({
        eth_id: parseInt(person.id, 10),
        department_uid: department_uid,
        name: person.attributes.name,
        full_name: person.attributes.fullName,
        email: person.attributes.email || null,
        phone: person.attributes.phone || null,
        location: person.attributes.location || null,
        image_url: person.attributes.image || null,
        detail_link: person.attributes.detailLink || null,
      }));

      allProfessors = allProfessors.concat(mappedStaff);
    }

    console.log(
      `Found ${allProfessors.length} total records. Uploading to Supabase...`,
    );

    const chunkSize = 500;
    for (let i = 0; i < allProfessors.length; i += chunkSize) {
      const chunk = allProfessors.slice(i, i + chunkSize);
      const { error } = await supabase
        .from("professors")
        .upsert(chunk, { onConflict: "eth_id" });

      if (error) throw error;
      console.log(`Uploaded batch ${Math.floor(i / chunkSize) + 1}`);
    }

    console.log(
      "Migration complete! All data is now correctly linked in Supabase.",
    );
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateData();

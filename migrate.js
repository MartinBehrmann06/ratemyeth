import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import dotenv from "dotenv";

// Load your .env.local variables
dotenv.config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
	try {
		console.log("Reading local JSON file...");
		const fileContent = await readFile("./assets/eth_all_departments.json", "utf-8");
		const ethData = JSON.parse(fileContent);

		let allProfessors = [];

		// Flatten the nested JSON into a single array of database rows
		for (const [department, deptData] of Object.entries(ethData)) {
			if (!deptData.data) continue;

			const mappedStaff = deptData.data.map((person) => ({
				id: person.id,
				department: department, // 'arch', 'baug', etc.
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

		console.log(`Found ${allProfessors.length} total records. Uploading to Supabase...`);

		// Insert data in chunks to avoid overwhelming the database payload limit
		const chunkSize = 500;
		for (let i = 0; i < allProfessors.length; i += chunkSize) {
			const chunk = allProfessors.slice(i, i + chunkSize);
			const { error } = await supabase.from("professors").upsert(chunk);

			if (error) throw error;
			console.log(`Uploaded batch ${i / chunkSize + 1}`);
		}

		console.log("Migration complete! All data is now in Supabase.");
	} catch (error) {
		console.error("Migration failed:", error);
	}
}

migrateData();

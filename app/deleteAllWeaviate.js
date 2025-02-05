import axios from "axios";

const WEAVIATE_URL = process.env.WEAVIATE_URL;
const ADMIN_API_KEY = process.env.WEAVIATE_API_KEY;

async function deleteAllObjects() {
    try {
        console.log("Fetching all objects from Weaviate...");

        const response = await axios.get(`${WEAVIATE_URL}/v1/objects`, {
            headers: {
                Authorization: `Bearer ${ADMIN_API_KEY}`,
            },
        });

        const objects = response.data.objects;
        if (!objects || objects.length === 0) {
            console.log("No objects found in Weaviate.");
            return;
        }

        console.log(`Found ${objects.length} objects. Deleting now...`);

        for (const obj of objects) {
            const objectId = obj.id;
            try {
                await axios.delete(`${WEAVIATE_URL}/v1/objects/${objectId}`, {
                    headers: {
                        Authorization: `Bearer ${ADMIN_API_KEY}`,
                    },
                });
                console.log(`✅ Deleted object: ${objectId}`);
            } catch (err) {
                console.error(`❌ Failed to delete object ${objectId}:`, err.response?.data || err.message);
            }
        }

        console.log("🎉 All objects deleted successfully.");
    } catch (error) {
        console.error("❌ Error fetching objects:", error.response?.data || error.message);
    }
}

deleteAllObjects();
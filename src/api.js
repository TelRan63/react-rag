const API_URL =
    "http://localhost:8000/api";

async function handleResponse(response) {

    if (response.ok) {
        return response.json();
    }

    let message =
        `HTTP ${response.status}`;

    try {

        const data =
            await response.json();

        message =
            data.detail ?? message;

    } catch {
        // Response was not JSON.
    }

    throw new Error(message);
}

export async function getDocuments() {

    const response = await fetch(
        `${API_URL}/documents`
    );

    return handleResponse(
        response
    );
}

export async function askQuestion(
    question
) {

    const response = await fetch(
        `${API_URL}/ask`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                question,
            }),
        }
    );

    return handleResponse(
        response
    );
}

export async function uploadDocument(
    file
) {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response = await fetch(
        `${API_URL}/documents`,
        {
            method: "POST",
            body: formData,
        }
    );

    return handleResponse(
        response
    );
}

export async function deleteDocument(
    filename
) {

    const response = await fetch(
        `${API_URL}/documents/` +
        encodeURIComponent(filename),
        {
            method: "DELETE",
        }
    );

    return handleResponse(
        response
    );
}
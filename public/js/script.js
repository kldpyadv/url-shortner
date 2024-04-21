async function checkAliasAvailability(alias, orgURL) {
    try {
        const response = await fetch(`/api/check-alias?alias=${encodeURIComponent(alias)}&orgURL=${encodeURIComponent(orgURL)}`);
        if (response.ok) {
            const data = await response.json();
            return { available: data.available };
        } else if (response.status === 400) {
            const errorData = await response.json();
            return { available: false, error: errorData.error };
        } else {
            return { available: false, error: 'An unexpected error occurred.' };
        }
    } catch (error) {
        return { available: false, error: 'Network error or problem with fetch operation.' };
    }
}

async function generateShortURL(){
    const response = await fetch(`/url/generate-url`);
    const data = await response.json();
    const shortURLInput = document.getElementById('shortURL');
    shortURLInput.value = data.id;
}

document.addEventListener('DOMContentLoaded', () => {
    const orgURLInput = document.getElementById('orgURL');
    const shortURLInput = document.getElementById('shortURL');
    const submitButton = document.getElementById('submitButton');
    const availabilityStatus = document.getElementById('availabilityStatus');
    let orgUrlError = document.getElementById('orgUrlError');
    if (!orgUrlError) {
        orgUrlError = document.createElement('div');
        orgUrlError.id = 'orgUrlError';
        orgURLInput.parentNode.insertBefore(orgUrlError, orgURLInput.nextSibling);
    }

    if (!orgURLInput || !shortURLInput || !submitButton || !availabilityStatus) {
        return; 
    }

    const updateButtonState = async () => {
        const orgURL = orgURLInput.value.trim();
        const shortURL = shortURLInput.value.trim();
        orgUrlError.textContent = '';
        orgUrlError.className = '';

        submitButton.disabled = true;

        if (orgURL && shortURL) {
            const result = await checkAliasAvailability(shortURL, orgURL);

            if (!result.available && result.error) {
                if (result.error.toLowerCase().includes('invalid orgurl')) {
                    orgUrlError.textContent = 'Invalid URL';
                    orgUrlError.className = 'text-red-700 font-semibold text-sm';
                } else {
                    availabilityStatus.textContent = result.error;
                }
            }else{
                submitButton.disabled = !result.available;
                availabilityStatus.textContent = result.available ? 'Available' : 'Unavailable';
                availabilityStatus.className = result.available ? 'text-green-700 font-semibold text-sm' : 'text-red-700 font-semibold text-sm';
            }
        } else {
            availabilityStatus.textContent = '';
            submitButton.disabled = true;
        }
    };

    orgURLInput.addEventListener('input', updateButtonState);
    shortURLInput.addEventListener('input', updateButtonState);
});

function copyToClipboard() {
    const copyText = document.getElementById("resultURL");
    const tooltip = document.getElementById("copyTooltip");
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copyText.value)
            .then(() => {
                showTooltip();
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    } else {
        copyText.select();
        document.execCommand("copy");
        showTooltip();
    }

    function showTooltip() {
        tooltip.classList.remove('opacity-0');
        tooltip.classList.add('opacity-100');
        setTimeout(() => {
            tooltip.classList.remove('opacity-100');
            tooltip.classList.add('opacity-0');
        }, 2000);
    }
}


generateShortURL();

document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const orgURL = document.getElementById('orgURL').value;
    const shortURL = document.getElementById('shortURL').value;

    fetch('/url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orgURL, shortURL })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            document.getElementById('resultURL').value = `urlfy.fun/${data.id}`;
            document.getElementById('resultURL').onclick = function() {
                copyToClipboard() // Reload the page
            };
            document.getElementById('urlForm').innerHTML = '';
            const newButton = document.createElement('button');
            newButton.textContent = 'Shorten New URL';
            newButton.className = 'w-full p-3 bg-primary text-white rounded-lg hover:bg-primary hover:bg-opacity-85 font-semibold mt-4';
            newButton.onclick = function() {
                window.location.reload(); // Reload the page
            };
            document.getElementById('shortenedUrlContainer').appendChild(newButton);
        } else if (data.error) {
            document.getElementById('orgUrlError').textContent = data.error; 
            document.getElementById('orgUrlError').className = 'text-red-700 font-semibold text-sm';
        } else {
            document.getElementById('resultURL').value = 'Error: No URL returned';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('resultURL').value = 'Error submitting URL';
    });
});


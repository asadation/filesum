document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("checksumForm");
    const fileInput = document.getElementById("fileInput");
    const inputChecksum = document.getElementById("inputChecksum");
    const resultMessage = document.getElementById("result");
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const tiles = document.querySelectorAll('.tile');
    let selectedValue = 'SHA-1';
    
    radioButtons.forEach((radioButton, index) => {
      radioButton.addEventListener("change", () => {
        tiles.forEach(tile => tile.classList.remove('selected'));
        tiles[index].classList.add('selected');
        selectedValue = radioButton.value;
        console.log(`Selected option: ${selectedValue}`);
      });
    
      // Manually trigger the change event for the initially selected radio button
      if (radioButton.checked) {
        radioButton.dispatchEvent(new Event('change'));
      }
    });
    

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const file = fileInput.files[0];

        if (!file) {
            resultMessage.textContent = "Please select a file.";
            return;
        }

        const reader = new FileReader();

        reader.onload = async function(event) {
            const fileBuffer = event.target.result;
            const checksum = await calculateChecksum(fileBuffer); // Wait for the promise to resolve
            console.log("Calculated Hex: " + checksum);

            const expectedChecksum = inputChecksum.value;
            console.log("Expected Checksum: " + expectedChecksum);

            if (checksum === expectedChecksum) {
                resultMessage.textContent = "Checksums match!";
            } else {
                resultMessage.textContent = "Checksums do not match!";
            }
        };

        reader.readAsArrayBuffer(file);
    });

    async function calculateChecksum(fileBuffer) {
        // Use a hashing algorithm like SHA-256
        const hashBuffer = await crypto.subtle.digest(selectedValue, fileBuffer); // Wait for the promise to resolve
        console.log("Calculated hash: " + hashBuffer);

        // Convert the hash to hexadecimal representation
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }
});


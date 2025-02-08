document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('downloadForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const form = new FormData(this);
        const data = {
            name: form.get('name'),
            phone: form.get('phone'),
            email: form.get('email'),
            city: form.get('city'),
            state: form.get('state')
        };

        // ✅ Ensure correct API request URL
        fetch('https://blazemarketingm.blazemarketingmedia.com/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✅ Form submitted successfully! Your book will download shortly.');
                
                // ✅ Trigger PDF download
                const a = document.createElement('a');
                a.href = 'Digital_Marketing.pdf';
                a.download = 'Digital_Marketing.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert('❌ Submission failed: ' + (data.message || 'Unknown error.'));
            }
        })
        .catch(error => {
            alert('❌ Error: ' + error.message);
        });
    });
});

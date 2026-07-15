const data = {
    service_id: 'service_nv7lbfm',
    template_id: 'template_a2ina0p',
    user_id: 'CFhswgMSN9JYt7KgA',
    template_params: {
        'subscriber_email': 'test@example.com'
    }
};

fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(r => r.text())
.then(console.log);

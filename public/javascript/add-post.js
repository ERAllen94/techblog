async function newFormHandler(event) {
    event.preventDefault();
console.log('what is happening')
   
    const title = document.querySelector('input[name="post-title"]').value;
    const text = document.querySelector("#post-text").value;

    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            text
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(title,text)

    if(response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
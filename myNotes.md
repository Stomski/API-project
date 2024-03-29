TESTING ROUTES

to test creation of a user :::::

http://localhost:8000/api/csrf/restore

fetch('/api/users', {
method: 'POST',
headers: {
"Content-Type": "application/json",
"XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
},
body: JSON.stringify({
firstName:'pete',
lastName:'Parker,
email: 'spidey@spider.man',
username: 'Spidey',
password: 'password'
})
}).then(res => res.json()).then(data => console.log(data));

to test the login of a user

http://localhost:8000/api/csrf/restore

fetch('/api/session', {
method: 'POST',
headers: {
"Content-Type": "application/json",
"XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
},
body: JSON.stringify({ credential: 'Demo-lition', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));

OR

fetch('/api/session', {
method: 'POST',
headers: {
"Content-Type": "application/json",
"XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
},
body: JSON.stringify({ credential: 'demo@user.io', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));

http://localhost:8000/api/csrf/restore

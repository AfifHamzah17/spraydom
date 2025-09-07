module.exports = {
content: [
'./index.html',
'./src/**/*.{js,jsx,ts,tsx}'
],
theme: {
extend: {
colors: {
primary: '#39375B',
secondary: '#745C97',
accent: '#D597CE',
pink: '#F5B0CB',
light: '#EBEBEB'
}
}
},
plugins: [require('daisyui')],
daisyui: {
themes: ['light'],
base: false
}
}

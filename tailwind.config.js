module.exports = {
content: [
'./index.html',
'./src/**/*.{js,jsx,ts,tsx}'
],
theme: {
extend: {
colors: {
primary: '#0C2B4E',
secondary: '#1A3D64',
third: '#1D546C',
fourth: '#F4F4F4',
}
}
},
plugins: [require('daisyui')],
daisyui: {
themes: ['light'],
base: false
}
}

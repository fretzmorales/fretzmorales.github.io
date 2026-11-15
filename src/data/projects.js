import mrrac from '../assets/images/mrrac.webp'
import connoley from '../assets/images/connoley.webp'
import ims from '../assets/images/ims.webp'

// Replace images by overwriting the files in src/assets/images (1440×900 recommended).
export const projects = [
  {
    id: 'mrrac',
    number: '01',
    title: ['Margaret River', 'Air Conditioning'],
    name: 'Margaret River Air Conditioning',
    url: 'https://mrrac.au/',
    host: 'mrrac.au',
    category: 'WordPress / Website Design & Development',
    image: mrrac,
    tone: '#0a1315',
    role: [
      'Designed and developed the website',
      'Built with WordPress, Elementor and ACF',
      'Created responsive layouts',
      'Handled website migration and domain configuration',
    ],
  },
  {
    id: 'connoley',
    number: '02',
    title: ['Connoley', 'Building Group'],
    name: 'Connoley Building Group',
    url: 'https://connoleybuildinggroup.com.au/',
    host: 'connoleybuildinggroup.com.au',
    category: 'WordPress / Website Design & Development',
    image: connoley,
    tone: '#0b0e17',
    role: [
      'Designed and developed the website',
      'Implemented responsive layouts',
      'Built and customized WordPress pages',
    ],
  },
  {
    id: 'imsg',
    number: '03',
    title: ['Industrial Maintenance', '& Steel Fabrication'],
    name: 'Industrial Maintenance & Steel Fabrication',
    url: 'https://imsgptyltd.com/',
    host: 'imsgptyltd.com',
    category: 'WordPress / Website Design & Development',
    image: ims,
    tone: '#10130a',
    role: [
      'Designed and developed the website',
      'Built with WordPress, Elementor and ACF',
      'Handled website migration and domain configuration',
    ],
  },
]

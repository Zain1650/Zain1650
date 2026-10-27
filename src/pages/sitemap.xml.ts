import {services,caseStudies,posts} from '../data/content';
export function GET() {
 const paths=['/','/services/','/approach/','/case-studies/','/blog/','/about/','/contact/','/privacy/',...services.map(x=>`/services/${x.slug}/`),...caseStudies.map(x=>`/case-studies/${x.slug}/`),...posts.map(x=>`/blog/${x.slug}/`)];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>https://zperformance.co.uk${path}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
}

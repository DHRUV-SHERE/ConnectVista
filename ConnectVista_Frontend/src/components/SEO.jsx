import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * SEO Component for dynamic meta tags
 * Install: npm install react-helmet-async
 * Wrap app with <HelmetProvider> in main.jsx
 */
export default function SEO({ 
  title = 'ConnectVista - Your Service Marketplace',
  description = 'Find and book trusted local service providers near you. From plumbing to beauty services, ConnectVista connects you with verified professionals.',
  keywords = 'service marketplace, local services, service providers, booking platform, home services, ConnectVista',
  image = '/og-image.jpg',
  url = 'https://connectvista.com',
  type = 'website'
}) {
  const fullTitle = title.includes('ConnectVista') ? title : `${title} | ConnectVista`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ConnectVista" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
};

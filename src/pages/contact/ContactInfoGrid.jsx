import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ADMIN_CONTACT } from '../../constants/adminConstants';
import * as BsIcons from 'react-icons/bs';

export default function ContactInfoGrid({ fadeUp }) {
  const { data } = useSelector(state => state.siteContent);
  const content = data?.contact?.contact_info;

  const defaultCards = [
    {
      icon: "BsGeoAltFill",
      title: "Our Headquarters",
      addressLine1: `${ADMIN_CONTACT.ADDRESS.STREET}, ${ADMIN_CONTACT.ADDRESS.SUITE}`,
      addressLine2: `${ADMIN_CONTACT.ADDRESS.CITY}, ${ADMIN_CONTACT.ADDRESS.STATE} ${ADMIN_CONTACT.ADDRESS.ZIP}`
    },
    {
      icon: "BsEnvelopeFill",
      title: "Email Us",
      linkType: "email",
      value: ADMIN_CONTACT.EMAIL
    },
    {
      icon: "BsTelephoneFill",
      title: "Call Us",
      linkType: "phone",
      value: ADMIN_CONTACT.PHONE,
      subtext: ADMIN_CONTACT.OFFICE_HOURS
    }
  ];

  const cards = content?.cards || defaultCards;

  const renderIcon = (iconString) => {
    if (!iconString) return null;
    const IconCmp = BsIcons[iconString];
    if (!IconCmp) return null;
    return <IconCmp size={32} className="text-secondary mb-4" />;
  };

  const renderContent = (card) => {
    if (card.addressLine1 || card.addressLine2) {
      return (
        <>
          {card.addressLine1 && <p className="mb-0 text-muted">{card.addressLine1}</p>}
          {card.addressLine2 && <p className="mb-0 text-muted">{card.addressLine2}</p>}
        </>
      );
    }
    if (card.linkType === 'email') {
      return (
        <a href={`mailto:${card.value}`} className="text-muted text-decoration-none fw-bold" style={{ fontSize: '1.2rem' }}>
          {card.value}
        </a>
      );
    }
    if (card.linkType === 'phone') {
      return (
        <>
          <a href={`tel:${card.value.replace(/[^0-9+]/g, '')}`} className="text-muted text-decoration-none fw-bold mb-2 d-block" style={{ fontSize: '1.2rem' }}>
            {card.value}
          </a>
          {card.subtext && <p className="small text-secondary mb-0">{card.subtext}</p>}
        </>
      );
    }
    return null;
  };

  return (
    <section className="contact-section-spacing position-relative">
      <div className="fhhf-container">
        <div className="row g-4">
          {cards.map((card, index) => (
            <motion.div 
              key={index} 
              className="col-lg-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15 }}
            >
              <motion.div 
                className="contact-glass-card rounded-4 p-5 h-100 text-center"
                whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(0, 31, 84, 0.1)' }}
                transition={{ duration: 0.3 }}
              >
                {renderIcon(card.icon)}
                <h4 className="text-primary mb-3" style={{ fontFamily: 'var(--font-family-heading)', fontWeight: '700' }}>
                  {card.title}
                </h4>
                {renderContent(card)}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

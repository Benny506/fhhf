import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import * as BsIcons from 'react-icons/bs';
import { BsPeople, BsLaptop, BsLightningCharge, BsGlobe2 } from 'react-icons/bs'

export default function DonateImpact({ fadeUp, data }) {
  const defaultImpacts = [
    {
      icon: <BsPeople className="text-primary" />,
      number: "1,200+",
      title: "Students Sponsored",
      desc: "Providing free access to premium courses for underprivileged students."
    },
    {
      icon: <BsLaptop className="text-success" />,
      number: "450",
      title: "Devices Distributed",
      desc: "Laptops and tablets given to learners lacking essential hardware."
    },
    {
      icon: <BsLightningCharge className="text-warning" />,
      number: "50+",
      title: "Instructor Grants",
      desc: "Funding expert instructors to create high-quality, localized content."
    },
    {
      icon: <BsGlobe2 className="text-info" />,
      number: "15",
      title: "Community Hubs",
      desc: "Establishing internet-enabled learning centers in remote areas."
    }
  ];

  const renderImpacts = data?.metrics && data.metrics.length > 0 ? data.metrics : defaultImpacts;
  const headline = data?.headline || "The Impact of Your Gift";
  const description = data?.description || "Every donation, no matter the size, goes directly towards breaking down barriers to education. Here is what our community has achieved so far.";

  return (
    <section className="donate-impact-section">
      <Container>
        <Row className="mb-5 text-center justify-content-center">
          <Col lg={8}>
            <motion.h2
              className="fw-bold mb-3 text-light"
              style={{ fontFamily: 'var(--font-family-heading)' }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            <motion.p
              className="text-white-50"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {description}
            </motion.p>
          </Col>
        </Row>

        <Row className="g-4">
          {renderImpacts.map((item, idx) => {
            const IconCmp = typeof item.icon === 'string' ? (BsIcons[item.icon] || BsIcons.BsCircle) : null;
            return (
              <Col md={6} lg={3} key={idx}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-100"
                >
                  <div className="impact-bento-card">
                    <div className="impact-icon-wrapper">
                      {IconCmp ? <IconCmp className="text-secondary" /> : item.icon}
                    </div>
                    <div className="impact-number">{item.number}</div>
                    <h5 className="fw-bold text-white mb-2">{item.title}</h5>
                    <p className="text-white-50 small mb-0 lh-lg">{item.desc}</p>
                  </div>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}

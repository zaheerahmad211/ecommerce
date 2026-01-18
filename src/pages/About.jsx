import { Users, Target, Globe, Award, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
      bio: '10+ years in e-commerce'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Tech innovation specialist'
    },
    {
      name: 'Emma Davis',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Digital marketing expert'
    },
    {
      name: 'David Wilson',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Supply chain management'
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Integrity',
      description: 'We believe in transparency and honesty'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Striving for the best in quality and service'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Constantly evolving to meet your needs'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Founded ShopEase with a vision to revolutionize online shopping' },
    { year: '2021', event: 'Reached 10,000 happy customers and expanded product range' },
    { year: '2022', event: 'Launched mobile app and international shipping' },
    { year: '2023', event: 'Featured in Forbes as one of the fastest growing e-commerce platforms' },
    { year: '2024', event: 'Expanded to 50+ countries with over 1 million products' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About ShopEase
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're on a mission to make online shopping seamless, secure, and enjoyable for everyone. 
          Since 2020, we've been connecting customers with quality products from around the world.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
          <Link to="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '1M+', label: 'Products Available' },
            { value: '500K+', label: 'Happy Customers' },
            { value: '50+', label: 'Countries Served' },
            { value: '24/7', label: 'Customer Support' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                ShopEase was born from a simple idea: shopping online should be easy, reliable, 
                and enjoyable. What started as a small project in 2020 has grown into a global 
                platform serving customers in over 50 countries.
              </p>
              <p>
                Our journey has been guided by customer feedback and a commitment to quality. 
                Every product in our catalog is carefully selected, and every service is designed 
                with your convenience in mind.
              </p>
              <p>
                Today, we're proud to be more than just an e-commerce platform. We're a community 
                of passionate shoppers, dedicated sellers, and innovative team members working 
                together to redefine online retail.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
              alt="Our team"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <Award className="w-12 h-12 text-yellow-500 mb-2" />
              <p className="font-semibold">"Best E-commerce Platform 2023"</p>
              <p className="text-sm text-gray-600">- Retail Excellence Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="card text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 mb-4">
                {value.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="card text-center group hover:border-blue-300 transition-all">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <p className="text-white text-sm">{member.bio}</p>
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-1">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{member.role}</p>
              <div className="flex justify-center space-x-3">
                <button className="p-2 hover:bg-blue-50 rounded-full">
                  <span className="sr-only">LinkedIn</span>
                  {/* Add social icons */}
                </button>
                <button className="p-2 hover:bg-blue-50 rounded-full">
                  <span className="sr-only">Twitter</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 transform md:-translate-x-1/2"></div>
          
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`relative mb-8 ${index % 2 === 0 ? 'md:pr-8 md:text-right md:mr-1/2' : 'md:pl-8 md:ml-1/2'}`}
            >
              <div className={`flex ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 max-w-md ${index % 2 === 0 ? 'md:mr-4' : 'md:ml-4'}`}>
                  <div className="text-2xl font-bold mb-2">{milestone.year}</div>
                  <p>{milestone.event}</p>
                </div>
              </div>
              {/* Timeline dot */}
              <div className={`absolute top-6 w-4 h-4 bg-white rounded-full border-4 border-blue-500 ${index % 2 === 0 ? 'left-2 md:left-1/2 md:transform md:-translate-x-1/2' : 'left-2 md:left-1/2 md:transform md:-translate-x-1/2'}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of our growing family of satisfied customers and sellers
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Start Shopping
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
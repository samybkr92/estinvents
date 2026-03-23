require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Event = require('./models/Event');
const News = require('./models/News');
const Professor = require('./models/Professor');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([User.deleteMany(), Event.deleteMany(), News.deleteMany(), Professor.deleteMany()]);
  console.log('🗑️  Cleared existing data');

  // Create admin user
  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'Estin',
    email: 'a_estin@estin.dz',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    year: 1,
  });

  // Create sample student
  await User.create({
    firstName: 'Bilal',
    lastName: 'Boutria',
    email: 'b_boutria@estin.dz',
    password: 'student123',
    role: 'student',
    department: 'Computer Science',
    year: 2,
  });

  // Create events
  const events = await Event.insertMany([
    {
      title: 'Hackathon ESTIN 2025',
      description: 'The annual 48-hour hackathon bringing together the brightest minds at ESTIN to solve real-world problems. Teams of 3-5 compete for prizes and internship opportunities.',
      category: 'workshop',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      location: 'Amphithéâtre Principal',
      organizer: 'Club Tech ESTIN',
      createdBy: admin._id,
      capacity: 150,
      isFeatured: true,
      tags: ['coding', 'competition', 'tech'],
    },
    {
      title: 'Journée Portes Ouvertes',
      description: 'Découvrez les filières et opportunités offertes par ESTIN. Rencontrez les professeurs et les anciens étudiants lors de cette journée exceptionnelle.',
      category: 'academic',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      location: 'Campus ESTIN',
      organizer: 'Direction ESTIN',
      createdBy: admin._id,
      isFeatured: true,
      tags: ['campus', 'orientation'],
    },
    {
      title: 'Conférence IA & Machine Learning',
      description: 'Une conférence internationale sur les avancées récentes en intelligence artificielle et machine learning, présentée par des experts de l\'industrie.',
      category: 'conference',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: 'Salle des Conférences - Bloc A',
      organizer: 'Département Informatique',
      createdBy: admin._id,
      capacity: 200,
      isFeatured: true,
      tags: ['AI', 'ML', 'tech'],
    },
    {
      title: 'Tournoi de Football Inter-Promo',
      description: 'Compétition sportive annuelle entre promotions. Inscrivez votre équipe et montrez vos talents sur le terrain!',
      category: 'sports',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      location: 'Terrain de sport ESTIN',
      organizer: 'Association Sportive ESTIN',
      createdBy: admin._id,
      capacity: 100,
      tags: ['sports', 'football', 'competition'],
    },
    {
      title: 'Atelier Développement Web Full-Stack',
      description: 'Formation pratique sur React.js, Node.js et MongoDB. Construisez une application complète en une journée avec des formateurs expérimentés.',
      category: 'workshop',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location: 'Salle Informatique 3 - Bloc B',
      organizer: 'Club Dev ESTIN',
      createdBy: admin._id,
      capacity: 30,
      tags: ['web', 'react', 'nodejs'],
    },
  ]);

  // Create news
  await News.insertMany([
    {
      title: 'Résultats des Examens du Semestre 1 — Disponibles',
      content: 'Les résultats des examens du premier semestre 2024-2025 sont désormais disponibles sur la plateforme officielle. Les étudiants peuvent consulter leurs notes en se connectant avec leurs identifiants ESTIN. En cas de contestation, les délais de réclamation sont ouverts pendant deux semaines suivant la publication.',
      excerpt: 'Les résultats du semestre 1 sont publiés. Consultez vos notes dès maintenant.',
      category: 'academic',
      author: admin._id,
      isPinned: true,
      tags: ['examens', 'résultats', 'semestre1'],
    },
    {
      title: 'Nouvelle Salle de Coworking Ouverte au Bloc C',
      content: 'Dans le cadre de l\'amélioration des infrastructures, l\'école est fière d\'annoncer l\'ouverture d\'une nouvelle salle de coworking moderne au Bloc C, niveau 2. Équipée de 50 postes de travail, d\'une connexion internet haut débit et de salles de réunion privées, cet espace est disponible pour tous les étudiants de 8h à 20h du dimanche au jeudi.',
      excerpt: 'Un espace moderne de 50 postes de travail ouvert à tous les étudiants.',
      category: 'announcement',
      author: admin._id,
      isPinned: false,
      tags: ['infrastructure', 'coworking'],
    },
    {
      title: 'L\'équipe ESTIN remporte le Prix National d\'Innovation',
      content: 'Félicitations à l\'équipe ESTIN composée de 5 étudiants de 3ème année qui ont remporté le Prix National d\'Innovation Technologique 2024 avec leur projet de système de navigation autonome. Cette récompense nationale récompense leur travail acharné et l\'excellence académique de notre établissement.',
      excerpt: 'Nos étudiants décrochent le Prix National d\'Innovation 2024. Bravo!',
      category: 'achievement',
      author: admin._id,
      tags: ['prix', 'innovation', 'réussite'],
    },
    {
      title: 'Planning des Rattrapages — Session de Janvier',
      content: 'Le calendrier des examens de rattrapage de la session de janvier 2025 est maintenant disponible. Les examens se dérouleront du 15 au 25 janvier. Consultez le planning détaillé par filière sur le tableau d\'affichage administratif ou téléchargez le document ci-joint.',
      excerpt: 'Rattrapages de janvier 2025 : consultez le planning par filière.',
      category: 'academic',
      author: admin._id,
      tags: ['rattrapages', 'planning', 'examen'],
    },
    {
      title: 'Recrutement : Club de Robotique ESTIN',
      content: 'Le Club de Robotique ESTIN lance son recrutement pour l\'année 2024-2025. Nous recherchons des étudiants passionnés par la robotique, l\'électronique et la programmation embarquée. Aucune expérience préalable requise, juste de la motivation! Les inscriptions sont ouvertes jusqu\'au 30 janvier.',
      excerpt: 'Rejoignez le Club Robotique! Recrutement ouvert jusqu\'au 30 janvier.',
      category: 'announcement',
      author: admin._id,
      tags: ['club', 'robotique', 'recrutement'],
    },
  ]);

  // Create professors
  await Professor.insertMany([
    {
      name: 'Dr. Amina Bensalem',
      department: 'Computer Science',
      email: 'a.bensalem@estin.dz',
      modules: ['Algorithmes Avancés', 'Structures de Données'],
      status: 'present',
      statusNote: '',
      statusUpdatedAt: new Date(),
      statusUpdatedBy: admin._id,
      schedule: [
        { day: 'Sunday', startTime: '08:00', endTime: '10:00', room: 'Amphi A', module: 'Algorithmes Avancés' },
        { day: 'Tuesday', startTime: '10:00', endTime: '12:00', room: 'Salle 12', module: 'Structures de Données' },
      ],
    },
    {
      name: 'Prof. Karim Meziane',
      department: 'Computer Science',
      email: 'k.meziane@estin.dz',
      modules: ['Bases de Données', 'Big Data'],
      status: 'absent',
      statusNote: 'En déplacement — cours annulé',
      statusUpdatedAt: new Date(),
      statusUpdatedBy: admin._id,
      schedule: [
        { day: 'Monday', startTime: '08:00', endTime: '10:00', room: 'Salle Info 3', module: 'Bases de Données' },
        { day: 'Wednesday', startTime: '14:00', endTime: '16:00', room: 'Salle Info 1', module: 'Big Data' },
      ],
    },
    {
      name: 'Dr. Fatima Yahiaoui',
      department: 'Mathematics',
      email: 'f.yahiaoui@estin.dz',
      modules: ['Analyse Mathématique', 'Probabilités et Statistiques'],
      status: 'present',
      statusNote: '',
      statusUpdatedAt: new Date(),
      statusUpdatedBy: admin._id,
      schedule: [
        { day: 'Sunday', startTime: '10:00', endTime: '12:00', room: 'Amphi B', module: 'Analyse Mathématique' },
        { day: 'Thursday', startTime: '08:00', endTime: '10:00', room: 'Salle 05', module: 'Probabilités et Statistiques' },
      ],
    },
    {
      name: 'Prof. Riadh Belkacem',
      department: 'Electronics',
      email: 'r.belkacem@estin.dz',
      modules: ['Électronique Numérique', 'Systèmes Embarqués'],
      status: 'unknown',
      statusNote: '',
      statusUpdatedAt: new Date(),
      statusUpdatedBy: admin._id,
    },
    {
      name: 'Dr. Nadia Chergui',
      department: 'Computer Science',
      email: 'n.chergui@estin.dz',
      modules: ['Réseaux Informatiques', 'Sécurité Informatique'],
      status: 'present',
      statusNote: 'Cours en salle 14',
      statusUpdatedAt: new Date(),
      statusUpdatedBy: admin._id,
    },
    {
      name: 'Prof. Omar Hadj-Aissa',
      department: 'Mathematics',
      email: 'o.hadjaissa@estin.dz',
      modules: ['Algèbre Linéaire', 'Mathématiques Discrètes'],
      status: 'absent',
      statusNote: 'Congé maladie',
      statusUpdatedAt: new Date(),
      statusUpdatedBy: admin._id,
    },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📋 Demo Accounts:');
  console.log('   Admin  → a_estin@estin.dz     / admin123');
  console.log('   Student → b_boutria@estin.dz   / student123');
  console.log('');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Timeline from '@/components/Timeline'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Grid from '@/components/Grid'
import { Award, GraduationCap, Briefcase, Heart } from 'lucide-react'

export const metadata = {
  title: 'About',
  description:
    'Learn about Subodh KC - AI Compliance Architect, Technical Program Manager, and founder of HAIEC. From Louisiana Tech to leading AI strategy at Fortune 50.',
}

export default function AboutPage() {
  const values = [
    {
      icon: Briefcase,
      title: 'Strategic Execution',
      description:
        'Complex problems require surgical precision. I build systems and frameworks that work at scale.',
    },
    {
      icon: Award,
      title: 'Excellence as Standard',
      description:
        'From Dean\'s Honor List to enterprise leadership, high standards aren\'t optional—they\'re the baseline.',
    },
    {
      icon: GraduationCap,
      title: 'Continuous Learning',
      description:
        'Technology evolves. Regulations shift. Staying ahead means never stopping the pursuit of deeper expertise.',
    },
    {
      icon: Heart,
      title: 'Impact Over Activity',
      description:
        'It\'s not about the number of programs shipped. It\'s about the problems solved and value created.',
    },
  ]

  const journey = [
    {
      date: '2022 - Present',
      title: 'Sr Program Manager - AI Core Team Lead',
      subtitle: 'HP Inc. (Fortune 50)',
      description:
        'Leading AI strategy and compliance initiatives across global enterprise. Driving technical programs that balance innovation velocity with regulatory requirements.',
    },
    {
      date: '2020 - Present',
      title: 'Founder & Leader',
      subtitle: 'Human AI Ethics Council (HAIEC)',
      description:
        'Built comprehensive platform for AI governance, compliance, and ethical deployment. Created frameworks including Cognitive Systems Management, Red Audit Kit, and LegacyShift.',
    },
    {
      date: '2018 - 2022',
      title: 'Technical Program Manager',
      subtitle: 'Enterprise & Startup Experience',
      description:
        'Drove complex, multi-stakeholder programs across SaaS development, information security, and application development at scale.',
    },
    {
      date: '2020 - 2022',
      title: 'Louisiana Tech University',
      subtitle: 'Dean\'s Honor List & President\'s Honor List',
      description:
        'Completed education with 4.0 GPA recognition. Bulldog Scholarship recipient. Built foundation in information management, IT law, and technical leadership.',
    },
  ]

  return (
    <>
      <Hero
        subtitle="About"
        title={
          <>
            Building AI Systems
            <br />
            <span className="gradient-text">That Work. At Scale.</span>
          </>
        }
        description="From Louisiana Tech to leading AI compliance at Fortune 50. My path has been defined by one principle: strategic systems, sharp execution."
      />

      <Section
        subtitle="Background"
        title="At the Intersection of Strategy & Execution"
        description="I don't just manage programs. I architect systems that solve real problems while meeting the highest standards of compliance and governance."
      >
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            My career has been built at the intersection of technical program management, AI governance, and enterprise-scale execution. With 12+ years of experience driving complex programs across Fortune 50 enterprises and high-growth startups, I've learned that success in AI isn't just about the technology—it's about the frameworks, governance structures, and strategic thinking that enable innovation while managing risk.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            At HP, I lead AI strategy and compliance for our core team, navigating the complexity of deploying AI systems that must meet rigorous regulatory requirements while delivering business value. This role demands both technical depth and strategic vision—understanding not just how to build AI systems, but how to build them responsibly.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Through HAIEC (Human AI Ethics Council), I've channeled years of experience into practical frameworks and tools that help organizations move from AI pilots to production-grade systems. The Red Audit Kit, LegacyShift methodology, and Cognitive Systems Management approach are all born from real-world challenges I've encountered and solved.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            My approach is simple: no buzzwords, no fluff. Just strategic systems that work, executed with precision.
          </p>
        </div>
      </Section>

      <Section subtitle="Journey" title="Career Milestones" className="bg-secondary/20">
        <Timeline items={journey} />
      </Section>

      <Section subtitle="Core Values" title="What Drives My Work">
        <Grid cols={2}>
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
      </Section>

      <Section subtitle="Beyond Work" title="Personal Mission">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm passionate about mentoring the next generation of builders, particularly those from Nepal. Digital governance, AI compliance, and technical leadership aren't just career paths—they're opportunities to shape how technology serves society.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I believe in building systems that create leverage. Whether it's a governance framework that protects millions of users, a program that ships months ahead of schedule, or a mentorship that unlocks someone's potential—the goal is always maximum impact.
          </p>
        </div>
      </Section>

      <CTA
        title="Let's Work Together"
        description="Whether you need advisory on AI compliance, executive coaching, or help driving a complex technical program, I bring strategic thinking and proven execution."
        primaryButton={{ text: 'Get in touch', href: '/contact' }}
        secondaryButton={{ text: 'View services', href: '/advisory' }}
      />
    </>
  )
}

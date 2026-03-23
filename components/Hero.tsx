import { ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import HeroAnimation from './HeroAnimation'

interface HeroProps {
  title: string | ReactNode
  subtitle?: string
  description?: string
  children?: ReactNode
  className?: string
  imageSrc?: string
  imageAlt?: string
  layout?: 'center' | 'split'
}

export default function Hero({ 
  title, 
  subtitle, 
  description, 
  children, 
  className,
  imageSrc,
  imageAlt = 'Profile',
  layout = 'center'
}: HeroProps) {
  if (layout === 'split' && imageSrc) {
    return (
      <section className={cn('page-padding pt-32 pb-20 relative overflow-hidden', className)}>
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <HeroAnimation />
        </div>
        
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Text Content */}
            <div className="space-y-8 text-center lg:text-left">
              {subtitle && (
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                  <span className="text-sm font-medium text-primary">{subtitle}</span>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {title}
              </h1>

              {description && (
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}

              {children && <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">{children}</div>}
            </div>

            {/* Professional Photo with Half-Box 3D Effect */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto lg:max-w-lg">
                {/* Animated gradient background */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-3xl blur-3xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Main image container with 3D effect */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                >
                  {/* Shadow layer for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 rounded-3xl translate-y-4 blur-xl" />
                  
                  {/* Half-border frame effect */}
                  <div className="relative">
                    {/* Top-left border */}
                    <motion.div
                      className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-primary rounded-tl-3xl"
                      animate={{
                        borderColor: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary))"],
                      }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                    
                    {/* Bottom-right border */}
                    <motion.div
                      className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-accent rounded-br-3xl"
                      animate={{
                        borderColor: ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--accent))"],
                      }}
                      transition={{ duration: 6, repeat: Infinity, delay: 3 }}
                    />
                    
                    {/* Image with 3D transform */}
                    <motion.div
                      className="relative overflow-hidden rounded-3xl"
                      style={{
                        transformStyle: "preserve-3d",
                        perspective: "1000px",
                      }}
                      whileHover={{
                        rotateY: 5,
                        rotateX: -5,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Gradient overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 mix-blend-overlay z-10" />
                      
                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 z-20"
                        style={{
                          transform: "translateX(-100%) translateY(-100%) rotate(45deg)",
                        }}
                        whileHover={{
                          transform: "translateX(100%) translateY(100%) rotate(45deg)",
                        }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Main image */}
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover relative z-0"
                        priority
                      />
                      
                      {/* Bottom accent line */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: "200% 100%" }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('page-padding pt-32 relative overflow-hidden', className)}>
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <HeroAnimation />
      </div>
      
      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {subtitle && (
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <span className="text-sm font-medium text-primary">{subtitle}</span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {children && <div className="flex flex-wrap gap-4 justify-center pt-4">{children}</div>}
        </div>
      </div>
    </section>
  )
}

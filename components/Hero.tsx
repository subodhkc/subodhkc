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
      <section className={cn('page-padding pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden', className)}>
        <div className="absolute inset-0 -z-10">
          <HeroAnimation />
        </div>
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 lg:gap-20 items-center min-h-[500px] md:min-h-[600px]">
            {/* Content Section - Better proportions */}
            <div className="space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-1">
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium">
                    {subtitle}
                  </span>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight"
              >
                {title}
              </motion.h1>

              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl"
                >
                  {description}
                </motion.p>
              )}

              {children && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4"
                >
                  {children}
                </motion.div>
              )}
            </div>

            {/* Photo Section - 3D Coin Flip Animation */}
            <div className="relative order-1 lg:order-2">
              <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] aspect-square mx-auto">
                {/* Animated gradient background */}
                <motion.div
                  className="absolute -inset-6 md:-inset-8 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* 3D Coin Flip Container */}
                <motion.div
                  className="relative w-full h-full"
                  style={{
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ opacity: 0, rotateY: -180 }}
                  animate={{ 
                    opacity: 1,
                    rotateY: 0,
                  }}
                  transition={{ 
                    duration: 1.2,
                    ease: "easeOut"
                  }}
                >
                  {/* Continuous subtle rotation */}
                  <motion.div
                    className="relative w-full h-full"
                    animate={{
                      rotateY: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{
                      rotateY: 360,
                      transition: { duration: 1.5, ease: "easeInOut" }
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Outer rotating gradient ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full p-[3px] md:p-1"
                      style={{
                        background: "linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
                        backgroundSize: "200% 200%",
                        transformStyle: "preserve-3d",
                      }}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Inner spacing ring */}
                      <div className="w-full h-full rounded-full bg-background p-1.5 md:p-2">
                        {/* Secondary gradient ring */}
                        <motion.div
                          className="w-full h-full rounded-full p-[3px] md:p-1"
                          style={{
                            background: "linear-gradient(-45deg, hsl(var(--accent)), hsl(var(--primary)), hsl(var(--accent)))",
                            backgroundSize: "200% 200%",
                          }}
                          animate={{
                            backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
                          }}
                          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                        >
                          {/* Image container */}
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 mix-blend-overlay z-10" />
                            
                            {/* Shine effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full -translate-y-full rotate-45 z-20"
                              animate={{
                                translateX: ['-100%', '100%'],
                                translateY: ['-100%', '100%'],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "easeInOut"
                              }}
                            />
                            
                            {/* Main image */}
                            <Image
                              src={imageSrc}
                              alt={imageAlt}
                              width={600}
                              height={600}
                              className="w-full h-full object-cover relative z-0"
                              priority
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    {/* Floating accent dots */}
                    <motion.div
                      className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary shadow-lg"
                      animate={{
                        y: [-6, 6, -6],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent shadow-lg"
                      animate={{
                        y: [6, -6, 6],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                  </motion.div>
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

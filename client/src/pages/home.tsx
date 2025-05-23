import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LeadForm from "@/components/forms/lead-form";
import QuizComponent from "@/components/quiz/quiz-component";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { Course, Testimonial } from "@shared/schema";
import { useEffect, useRef, useState } from "react";
import { useMouseParallax, useParallax } from "@/hooks/use-parallax";

export default function Home() {
  const observerRef = useRef<IntersectionObserver>();
  const { mousePosition } = useMouseParallax();
  const parallaxData = useParallax();
  
  // Enhanced parallax tracking for different layers
  const [parallaxLayers, setParallaxLayers] = useState({
    background: { x: 0, y: 0 },
    midground: { x: 0, y: 0 },
    foreground: { x: 0, y: 0 },
    floating: { x: 0, y: 0 }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const normalizedX = (clientX - centerX) / centerX;
      const normalizedY = (clientY - centerY) / centerY;
      
      setParallaxLayers({
        background: { x: normalizedX * 15, y: normalizedY * 15 },
        midground: { x: normalizedX * 30, y: normalizedY * 30 },
        foreground: { x: normalizedX * 45, y: normalizedY * 45 },
        floating: { x: normalizedX * 60, y: normalizedY * 60 }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { approved: true }],
  });

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const handleCTAClick = (ctaType: string) => {
    trackEvent("cta_click", "engagement", ctaType);
  };

  // Get scroll position
  const scrollY = parallaxData.offset;
  
  // Clean icon mapping function
  const getCleanIcon = (course: any) => {
    if (course.title.includes('Ethical Hacker') || course.title.includes('Cybersecurity')) return '🔒';
    if (course.title.includes('Bug Bounty')) return '🔍';
    if (course.title.includes('Java')) return '☕';
    if (course.title.includes('Python')) return '🐍';
    if (course.title.includes('Interview') || course.title.includes('Career')) return '🎯';
    if (course.category === 'cybersecurity') return '🛡️';
    if (course.category === 'development') return '💻';
    if (course.category === 'career') return '📈';
    return '📚';
  };
  
  const featuredCourses = courses.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header />
      
      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        {/* Clean Professional Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-16 h-16 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"></div>
        </div>
        <div className="absolute top-40 right-20 opacity-15" style={{animationDelay: '2s'}}>
          <div className="w-12 h-12 border border-slate-200 dark:border-slate-700 rounded-full bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm"></div>
        </div>
        <div className="absolute bottom-32 left-20 opacity-10" style={{animationDelay: '4s'}}>
          <div className="w-20 h-20 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm"></div>
        </div>
        <div className="absolute top-60 right-10 opacity-15" style={{animationDelay: '6s'}}>
          <div className="w-14 h-14 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/40 dark:bg-slate-800/40 backdrop-blur-sm"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-foreground">
                <span className="block mb-4">Master</span>
                <span className="text-primary">Cybersecurity</span>
              </h1>
              <p className="text-2xl text-muted-foreground mb-10 leading-relaxed">
                Professional cybersecurity and development training with 
                <span className="text-foreground font-medium">hands-on experience</span> and 
                <span className="text-foreground font-medium">industry certification</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Button 
                  className="btn-primary text-lg px-10 py-4"
                  onClick={() => handleCTAClick("get_demo")}
                >
                  Start Learning
                </Button>
                <Button 
                  className="bg-white hover:bg-black text-black hover:text-white border border-slate-300 hover:border-black text-lg px-10 py-4 transition-all duration-300"
                  onClick={() => handleCTAClick("connect_counsellor")}
                >
                  Schedule Consultation
                </Button>
              </div>
              
              {/* Compact Rectangle Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <div className="text-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-sm">
                  <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-b from-slate-600 to-slate-300 dark:from-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
                    1200+
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Students<br/>Trained</div>
                </div>
                <div className="text-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-sm">
                  <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-b from-slate-600 to-slate-300 dark:from-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
                    95%
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Placement Rate</div>
                </div>
                <div className="text-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-sm">
                  <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-b from-slate-600 to-slate-300 dark:from-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
                    40+
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Industry<br/>Partners</div>
                </div>
              </div>
            </div>
            
            <div 
              className="mt-16 lg:mt-0 relative transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(${parallaxLayers.midground.x * 0.5}px, ${parallaxLayers.midground.y * 0.5}px, 0) rotateY(${parallaxLayers.midground.x * 0.02}deg)`
              }}
            >
              <div className="relative border border-border rounded-lg p-8 card-professional">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                  alt="Cybersecurity expert working with advanced security systems" 
                  className="rounded-lg w-full h-auto transition-transform duration-500"
                  style={{
                    transform: `scale(${1 + Math.abs(parallaxLayers.foreground.x) * 0.001})`
                  }}
                />
                {/* InfoSec Terminal Overlay with Parallax */}
                <div 
                  className="absolute top-12 left-12 bg-black/80 rounded p-2 text-success font-mono text-xs opacity-80 transition-transform duration-300"
                  style={{
                    transform: `translate3d(${parallaxLayers.floating.x * 0.3}px, ${parallaxLayers.floating.y * 0.3}px, 0)`
                  }}
                >
                  <div>root@infosec:~$ nmap -sS target</div>
                  <div className="text-red-400">[!] Vulnerabilities found</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Course Carousel with Fade Effects */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto relative overflow-hidden">
          {/* Fade overlays for sides */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
          
          {/* Continuous Scroll Container */}
          <div 
            className="flex gap-8"
            style={{ 
              width: 'calc(200% + 64px)',
              animation: 'scroll-left 45s linear infinite'
            }}
          >
            {/* First set of courses */}
            {courses.map((course, index) => (
              <Card 
                key={`first-${course.id}`}
                className="border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 min-w-[350px] max-w-[350px] flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header with Icon and Level */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 text-center">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-3xl">{getCleanIcon(course)}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-100">
                      {course.title}
                    </h3>
                    
                    <div className={`text-xs font-semibold mb-3 px-4 py-2 rounded-full inline-block shadow-sm ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      course.level === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Enhanced Progress Bar */}
                    <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4 shadow-inner">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                          course.level === 'beginner' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          course.level === 'intermediate' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          'bg-gradient-to-r from-purple-400 to-purple-600'
                        }`}
                        style={{ width: `${75 + (index * 3)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                    
                    {/* Enhanced Course Features */}
                    {course.features && course.features.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {course.features.slice(0, 2).map((feature, idx) => (
                          <div 
                            key={idx}
                            className="text-xs bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg inline-block mx-1 shadow-sm border border-slate-200/50 dark:border-slate-600/50"
                          >
                            ✓ {feature}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Duration with Icon */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">🕐</span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {courses.map((course, index) => (
              <Card 
                key={`second-${course.id}`}
                className="border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 min-w-[350px] max-w-[350px] flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header with Icon and Level */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 text-center">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-3xl">{getCleanIcon(course)}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-100">
                      {course.title}
                    </h3>
                    
                    <div className={`text-xs font-semibold mb-3 px-4 py-2 rounded-full inline-block shadow-sm ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      course.level === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Enhanced Progress Bar */}
                    <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4 shadow-inner">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                          course.level === 'beginner' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          course.level === 'intermediate' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          'bg-gradient-to-r from-purple-400 to-purple-600'
                        }`}
                        style={{ width: `${75 + (index * 3)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                    
                    {/* Enhanced Course Features */}
                    {course.features && course.features.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {course.features.slice(0, 2).map((feature, idx) => (
                          <div 
                            key={idx}
                            className="text-xs bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg inline-block mx-1 shadow-sm border border-slate-200/50 dark:border-slate-600/50"
                          >
                            ✓ {feature}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Duration with Icon */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">🕐</span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Test Your Knowledge with Parallax */}
      <section className="py-20 bg-muted/50 relative overflow-hidden">
        {/* Floating Parallax Elements */}
        <div 
          className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${parallaxLayers.background.x * 0.8}px, ${parallaxLayers.background.y * 0.8}px, 0)`
          }}
        ></div>
        <div 
          className="absolute top-32 right-20 w-16 h-16 bg-accent/10 rounded-full transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${parallaxLayers.midground.x * -0.6}px, ${parallaxLayers.midground.y * 0.6}px, 0)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 left-32 w-12 h-12 bg-success/10 rounded-full transition-transform duration-400 ease-out"
          style={{
            transform: `translate3d(${parallaxLayers.floating.x * 0.4}px, ${parallaxLayers.floating.y * -0.4}px, 0)`
          }}
        ></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 
            className="text-4xl font-bold text-foreground mb-4 transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${parallaxLayers.midground.x * 0.1}px, ${parallaxLayers.midground.y * 0.1}px, 0)`
            }}
          >
            Test Your Knowledge
          </h2>
          <p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto transition-transform duration-400 ease-out"
            style={{
              transform: `translate3d(${parallaxLayers.foreground.x * 0.05}px, ${parallaxLayers.foreground.y * 0.05}px, 0)`
            }}
          >
            Take our quick assessment to see which course is perfect for you
          </p>
          <div
            className="transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${parallaxLayers.background.x * 0.2}px, ${parallaxLayers.background.y * 0.2}px, 0) scale(${1 + Math.abs(parallaxLayers.midground.y) * 0.0003})`
            }}
          >
            <QuizComponent />
          </div>
        </div>
      </section>

      {/* Why Choose Master in InfoSec */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div 
          className="absolute top-20 left-10 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-20 transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${parallaxLayers.background.x * 0.3}px, ${parallaxLayers.background.y * 0.3}px, 0)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-20 transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${parallaxLayers.midground.x * -0.2}px, ${parallaxLayers.midground.y * 0.2}px, 0)`
          }}
        ></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${parallaxLayers.foreground.x * 0.05}px, ${parallaxLayers.foreground.y * 0.05}px, 0)`
              }}
            >
              Why Choose Master in InfoSec?
            </h2>
            <p 
              className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto transition-transform duration-400 ease-out"
              style={{
                transform: `translate3d(${parallaxLayers.midground.x * 0.03}px, ${parallaxLayers.midground.y * 0.03}px, 0)`
              }}
            >
              What makes us different from other institutes
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div 
              className="text-center p-6 transition-transform duration-500 ease-out hover:scale-105"
              style={{
                transform: `translate3d(${parallaxLayers.floating.x * 0.1}px, ${parallaxLayers.floating.y * 0.1}px, 0)`
              }}
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <span className="text-2xl text-blue-600 dark:text-blue-400">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                80% Practical Approach
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlike traditional institutes, 80% of our curriculum is hands-on practice with real projects and industry tools.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              className="text-center p-6 transition-transform duration-500 ease-out hover:scale-105"
              style={{
                transform: `translate3d(${parallaxLayers.background.x * 0.08}px, ${parallaxLayers.background.y * 0.08}px, 0)`
              }}
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <span className="text-2xl text-green-600 dark:text-green-400">💼</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Real Industry Projects
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Work on actual client projects and build a portfolio that impresses employers from day one.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              className="text-center p-6 transition-transform duration-500 ease-out hover:scale-105"
              style={{
                transform: `translate3d(${parallaxLayers.midground.x * 0.06}px, ${parallaxLayers.midground.y * 0.06}px, 0)`
              }}
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <span className="text-2xl text-purple-600 dark:text-purple-400">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Industry Mentorship
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Learn directly from industry professionals currently working in top companies.
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              className="text-center p-6 transition-transform duration-500 ease-out hover:scale-105"
              style={{
                transform: `translate3d(${parallaxLayers.foreground.x * 0.04}px, ${parallaxLayers.foreground.y * 0.04}px, 0)`
              }}
            >
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <span className="text-2xl text-orange-600 dark:text-orange-400">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Placement Support
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Comprehensive placement assistance including resume building, interview prep, and direct company connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have transformed their careers with our hands-on approach
            </p>
            <LeadForm 
              source="homepage_cta"
              buttonText="Get Started Today"
              title="Get Your Free Career Consultation"
            />
          </div>
        </div>
      </section>

      {/* Enhanced WhatsApp Float Button with Parallax */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallaxLayers.floating.x * 0.3}px, ${parallaxLayers.floating.y * 0.3}px, 0) scale(${1 + Math.abs(parallaxLayers.floating.x) * 0.0008})`
        }}
        onClick={() => trackEvent("whatsapp_click", "contact", "float_button")}
      >
        <span className="text-2xl">💬</span>
      </a>

      {/* Premium Floating Parallax Decorative Elements */}
      <div 
        className="fixed top-20 right-10 w-6 h-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-sm pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{
          transform: `translate3d(${parallaxLayers.background.x * 1.2}px, ${parallaxLayers.background.y * 1.2}px, 0)`
        }}
      ></div>
      <div 
        className="fixed bottom-40 left-20 w-8 h-8 bg-gradient-to-r from-success/15 to-info/15 rounded-full blur-sm pointer-events-none transition-transform duration-500 ease-out z-0"
        style={{
          transform: `translate3d(${parallaxLayers.midground.x * -0.8}px, ${parallaxLayers.midground.y * 0.8}px, 0)`
        }}
      ></div>
      <div 
        className="fixed top-1/2 right-32 w-4 h-4 bg-gradient-to-r from-warning/20 to-electric/20 rounded-full blur-sm pointer-events-none transition-transform duration-600 ease-out z-0"
        style={{
          transform: `translate3d(${parallaxLayers.foreground.x * 0.9}px, ${parallaxLayers.foreground.y * -0.7}px, 0)`
        }}
      ></div>

      <Footer />
    </div>
  );
}

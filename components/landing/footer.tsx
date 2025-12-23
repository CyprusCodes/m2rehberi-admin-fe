'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Gamepad2, 
  Mail, 
  MessageCircle, 
  Shield, 
  Heart,
  ExternalLink,
  Twitter,
  Github,
  Linkedin
} from 'lucide-react'
import Link from 'next/link'
import { ServerApplicationForm } from './server-application-form'

export function LandingFooter() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Server Management', href: '#features' },
        { name: 'Forum System', href: '#features' },
        { name: 'Advertisement', href: '#features' },
        { name: 'Mobile App', href: '#mobile' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Tutorials', href: '#' },
        { name: 'FAQ', href: '#' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Community', href: '#' },
        { name: 'Contact Us', href: '#contact' },
        { name: 'Bug Reports', href: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'GDPR', href: '#' },
      ]
    }
  ]

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: MessageCircle, href: '#', label: 'Discord' },
  ]

  return (
    <footer id="contact" className="bg-muted/20 border-t border-border/50">
      {/* CTA Section */}
      <div className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Launch Your Server?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of server owners who trust Oyna.gg for their OynaGG server management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-2 hover:bg-muted/50 min-w-[200px]">
              <Mail className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Gamepad2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Oyna.gg</h3>
                  <p className="text-sm text-muted-foreground">OynaGG Server Management Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-md">
                The most comprehensive platform for managing OynaGG servers, building communities, 
                and growing your player base. Trusted by server owners worldwide.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 hover:bg-primary/10 hover:text-primary"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-foreground">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        {link.href.startsWith('http') && (
                          <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Bottom Footer */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 Oyna.gg. All rights reserved.</span>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Platform</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for the <a href="https://futurecast.studio" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">FutureCast Studio</a></span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary opacity-50" />
    </footer>
  )
}

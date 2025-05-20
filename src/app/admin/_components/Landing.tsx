/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { saveLandingConfig } from '@/actions/saveLandingConfig'

export default function PageControl({ initialData }: { initialData: any }) {
  const [sections, setSections] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleToggle = (sectionName: string, enabled: boolean) => {
    setSections((prev: any) => ({ ...prev, [sectionName]: enabled }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveLandingConfig(sections)
      toast.success('Changes saved successfully!')
      setHasChanges(false)
    } catch (error) {
      toast.error('Failed to save changes')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Landing Page Sections Control</h1>
          <p className="text-muted-foreground">Toggle sections to customize your landing page</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-[#6EC207] hover:bg-[#5BA906] text-white"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SectionToggle 
          name="navbar" 
          label="Top Bar" 
          enabled={sections?.navbar} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="search" 
          label="Search Input" 
          enabled={sections?.search} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="hero" 
          label="Hero Section" 
          enabled={sections?.hero} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="national" 
          label="National Section" 
          enabled={sections?.national} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="international" 
          label="International Section" 
          enabled={sections?.international} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="mesure" 
          label="Mesure Section" 
          enabled={sections?.mesure} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="reviews" 
          label="Reviews Section" 
          enabled={sections?.reviews} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="meeting" 
          label="Meeting Section" 
          enabled={sections?.meeting} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="expert" 
          label="Expert Section" 
          enabled={sections?.expert} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="trust" 
          label="Trust Section" 
          enabled={sections?.trust} 
          onToggle={handleToggle}
        />
        <SectionToggle 
          name="footer" 
          label="Footer" 
          enabled={sections?.footer} 
          onToggle={handleToggle}
        />
      </div>
    </div>
  )
}

function SectionToggle({ 
  name, 
  label, 
  enabled, 
  onToggle 
}: { 
  name: string; 
  label: string; 
  enabled?: boolean;
  onToggle: (name: string, enabled: boolean) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{label}</h3>
          <p className="text-sm text-muted-foreground">
            {enabled ? 'Visible on page' : 'Hidden from page'}
          </p>
        </div>
        <Switch 
          checked={enabled}
          onCheckedChange={(checked) => onToggle(name, checked)}
          className="data-[state=checked]:bg-[#6EC207]"
        />
      </div>
    </div>
  )
}
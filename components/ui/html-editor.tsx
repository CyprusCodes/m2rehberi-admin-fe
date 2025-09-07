"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Type,
  Eye,
  Code
} from "lucide-react"

interface HtmlEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function HtmlEditor({ 
  value, 
  onChange, 
  placeholder = "İçerik yazın...", 
  minHeight = "150px" 
}: HtmlEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")

  const insertTag = (tag: string, placeholder?: string) => {
    const textarea = document.querySelector('textarea[data-html-editor]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = placeholder || selectedText || "metin"
    
    let newText = ""
    if (tag === "br") {
      newText = "<br>"
    } else if (tag === "link") {
      newText = `<a href="${placeholder || "https://example.com"}" target="_blank">${selectedText || "bağlantı"}</a>`
    } else {
      newText = `<${tag}>${textToInsert}</${tag}>`
    }
    
    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)
    

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const formatText = (format: string) => {
    const textarea = document.querySelector('textarea[data-html-editor]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    if (!selectedText) {
      const placeholder = format === "strong" ? "kalın metin" : 
                         format === "em" ? "italik metin" : 
                         format === "u" ? "altı çizili metin" : "metin"
      insertTag(format, placeholder)
    } else {
      // Wrap selected text
      const newText = `<${format}>${selectedText}</${format}>`
      const newValue = value.substring(0, start) + newText + value.substring(end)
      onChange(newValue)
      
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + newText.length)
      }, 0)
    }
  }

  const insertList = (ordered: boolean = false) => {
    const textarea = document.querySelector('textarea[data-html-editor]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const listTag = ordered ? "ol" : "ul"
    const listItem = `<li>liste öğesi</li>`
    const newText = `<${listTag}>\n  ${listItem}\n</${listTag}>`
    
    const newValue = value.substring(0, start) + newText + value.substring(start)
    onChange(newValue)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const insertLink = () => {
    const url = prompt("Bağlantı URL'sini girin:")
    if (url) {
      const textarea = document.querySelector('textarea[data-html-editor]') as HTMLTextAreaElement
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const linkText = selectedText || "bağlantı"
      
      const newText = `<a href="${url}" target="_blank">${linkText}</a>`
      const newValue = value.substring(0, start) + newText + value.substring(end)
      onChange(newValue)
      
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + newText.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Düzenle
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Önizleme
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "edit" && (
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText("strong")}
                className="h-8 w-8 p-0"
                title="Kalın"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText("em")}
                className="h-8 w-8 p-0"
                title="İtalik"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatText("u")}
                className="h-8 w-8 p-0"
                title="Altı Çizili"
              >
                <Underline className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertList(false)}
                className="h-8 w-8 p-0"
                title="Madde İşareti Listesi"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertList(true)}
                className="h-8 w-8 p-0"
                title="Numaralı Liste"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertLink}
                className="h-8 w-8 p-0"
                title="Bağlantı Ekle"
              >
                <Link className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertTag("br")}
                className="h-8 w-8 p-0"
                title="Satır Sonu"
              >
                <Type className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="edit" className="mt-2">
          <Textarea
            data-html-editor
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="resize-none border-border/50 focus:border-primary/50 transition-colors font-mono text-sm"
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <div 
            className="border border-border/50 rounded-lg p-4 bg-background min-h-[150px] prose prose-sm max-w-none dark:prose-invert"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ 
              __html: value || '<p class="text-muted-foreground">Önizleme için içerik yazın...</p>' 
            }}
          />
        </TabsContent>
      </Tabs>
      
      <p className="text-xs text-muted-foreground">
        HTML etiketleri kullanabilirsiniz: &lt;strong&gt;, &lt;em&gt;, &lt;u&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;br&gt;, &lt;p&gt;
      </p>
    </div>
  )
}

import { ExerciseTemplateController } from "@/controllers/workout/exerciseTemplate.controller";
import { useEffect, useRef, useState } from "react";

interface ExerciseTemplate {
  id: number;
  name: string;
}

export const useExerciseSearch = () => {
  const [templates, setTemplates] = useState<ExerciseTemplate[]>([]);
  const [filtered, setFiltered] = useState<ExerciseTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ExerciseTemplate | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const isSelecting = useRef(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await ExerciseTemplateController.getTemplates();
        setTemplates(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ Błąd przy pobieraniu ćwiczeń:", err);
      }
    };
    fetchTemplates();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const lower = text.toLowerCase();

    setFiltered(
      templates.filter((t) => t.name.toLowerCase().includes(lower))
    );

    if (selectedTemplate) {
      setSelectedTemplate(null);
    }
  };

  const handleTemplateSelect = (item: ExerciseTemplate) => {
    isSelecting.current = true; 
    setSelectedTemplate(item);
    setSearch(item.name);
    setIsInputFocused(false);
    
    requestAnimationFrame(() => {
      isSelecting.current = false;
    });
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (isSelecting.current) return; 
      setIsInputFocused(false);
    }, 150);
  };

  const handleClear = () => {
    setSelectedTemplate(null);
    setSearch("");
    setFiltered(templates);
    setIsInputFocused(true); 
  };


  const isListVisible =
    isInputFocused && filtered.length > 0 && !selectedTemplate;

  return {
    filtered,
    search,
    selectedTemplate,
    isListVisible,
    handleSearch,
    handleTemplateSelect,
    handleInputFocus,
    handleInputBlur,
    handleClear, 
    setSelectedTemplate,
    setSearch,
  };
};
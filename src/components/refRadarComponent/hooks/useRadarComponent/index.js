import { useEffect, useState } from "react";
import { compareByEndElevation } from "../../utils";

export const useRadarComponent = (sections,targets, onClick, radius) => {
  const [sectionsData, setSectionsData] = useState(sections);
  const [targetsData, settTargetsData] = useState(targets);
  const width = radius * 2;
  const height = width;

  useEffect(()=>{
    if(sectionsData){
      sectionsData.sort(compareByEndElevation);
    }
  }, [sectionsData])

  useEffect(()=>{
    if(targetsData){
      targetsData.sort(compareByEndElevation);
    }
  }, [targetsData])

  const updateSelectedState = (dataArray, label) =>
    dataArray.map((data) => ({ ...data, selected: data.label === label }));

  const handleSectionClick = (event, d) => {
    const newSectionsData = updateSelectedState(sectionsData, d.data.label);
    if(targetsData){
      const newTargetsData = updateSelectedState(targetsData, null); // Unselect all targets
      settTargetsData(newTargetsData);
    }
    setSectionsData(newSectionsData);
    const newSelectedSection = { ...d.data, selected: true };
    onClick(newSelectedSection);
  };

  const handleTargetsClick = (event, d) => {
    const newTargetsData = updateSelectedState(targetsData, d.data.label);
    if(sectionsData){
      const newSectionsData = updateSelectedState(sectionsData, null); // Unselect all sections
      setSectionsData(newSectionsData);
    }
    settTargetsData(newTargetsData);
    const newSelectedTarget = { ...d.data, selected: true };
    onClick(newSelectedTarget);
  };

  return {
    handleSectionClick,
    handleTargetsClick,
    targetsData,
    sectionsData,
    width,
    height,
  };
};

export default useRadarComponent;

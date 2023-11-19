import React from "react";
import { Wine } from '../Types/WineTypes' // Importing Wine type

interface Props {
  wineData: Wine[];
}

const FlavanoidsStatistics: React.FC<Props> = ({ wineData }) => {

  // Function to get unique classes from wine data
  const getUniqueClasses = (): number[] => {
    const uniqueClasses = new Set(wineData.map((wine) => wine.Alcohol));
    return Array.from(uniqueClasses);
  };

  
  // Calculate mean value of Flavanoids for a given alcohol type
  const calculateFlavanoidsMean = (alcoholType: number): number => {
    const filteredByClass = wineData.filter(
      (wine) => wine.Alcohol === alcoholType
    );
    const flavanoidsValues = filteredByClass.map((wine) => wine.Flavanoids);

    const sum = flavanoidsValues.reduce((acc, val) => acc + val, 0);
    const mean = sum / flavanoidsValues.length || 0;

    return +mean.toFixed(3);
  };

 // Calculate median value of Flavanoids for a given alcohol type
  const calculateFlavanoidsMedian = (alcoholType: number): number => {
    const filteredByClass = wineData.filter(
      (wine) => wine.Alcohol === alcoholType
    );
    const flavanoidsValues = filteredByClass
      .map((wine) => wine.Flavanoids)
      .sort((a, b) => a - b);

    const mid = Math.floor(flavanoidsValues.length / 2);
    if (flavanoidsValues.length % 2 === 0) {
      const median = (flavanoidsValues[mid - 1] + flavanoidsValues[mid]) / 2;
      return parseFloat(median.toFixed(3));
    } else {
      return parseFloat(flavanoidsValues[mid].toFixed(3));
    }
  };

    // Calculate mode value of Flavanoids for a given alcohol type
  const calculateFlavanoidsMode = (alcoholType: number): number => {
    const filteredByClass = wineData.filter(
      (wine) => wine.Alcohol === alcoholType
    );
    const flavanoidsValues = filteredByClass.map((wine) => wine.Flavanoids);

    const frequencyMap = new Map<number, number>();
    flavanoidsValues.forEach((val) => {
      frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
    });

    const maxFrequency = Math.max(...frequencyMap.values());
    const modes = Array.from(frequencyMap.entries())
      .filter(([_, freq]) => freq === maxFrequency)
      .map(([val]) => parseFloat(val.toFixed(3)));

    // Return the first mode value if there's no mode or multiple modes
    return modes[0];

    //Return the array if there's multiple modes
    // return modes
  };

  // Render statistics table
  const renderStatistics = () => {
    const classes = getUniqueClasses();

    return (
      <table>
        <thead>
          <tr>
            <th>Measure</th>
            {classes.map((classNum) => (
              <th key={classNum}>
                Class {classNum}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          
          {["Mean", "Median", "Mode"].map((statistic) => (
            <tr key={statistic}>
              <td>
                Flavanoids {statistic}
              </td>
              {classes.map((classNum) => (
                <td key={`${statistic}-${classNum}`}>
                  {calculateStatistic(statistic, classNum)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Calculate a specific statistic (Mean, Median, or Mode) for a given alcohol type
  const calculateStatistic = (statistic: string, alcoholType: number): number => {
    switch (statistic) {
      case "Mean":
        return calculateFlavanoidsMean(alcoholType);
      case "Median":
        return calculateFlavanoidsMedian(alcoholType);
      case "Mode":
        return calculateFlavanoidsMode(alcoholType);
      default:
        return 0;
    }
  };

  return (
    <div>
      {renderStatistics()}
    </div>
  );
};

export default FlavanoidsStatistics;

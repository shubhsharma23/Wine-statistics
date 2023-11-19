import React from "react";
import { Wine } from '../Types/WineTypes' // Importing Wine type

interface Props {
  wineData: Wine[];
}

const GammaStatistics: React.FC<Props> = ({ wineData }) => {

  // Calculate Gamma based on given formula in the challenge document
  const calculateGamma = (data: Wine[]): Wine[] => {
    return data.map((wine) => {
      const gamma = (wine.Ash * wine.Hue) / wine.Magnesium;
      return { ...wine, Gamma: gamma };
    });
  };

  // Calculate Gamma Mean for a given alcohol type
  const calculateGammaMean = (data: Wine[], alcoholType: any) => {
    const filteredData = data.filter((wine) => wine.Alcohol === alcoholType);
    const gammaValues = filteredData.map((wine) =>
      wine.Gamma ? wine.Gamma : 0
    );
    const mean =
      gammaValues.reduce((acc, val) => acc + val, 0) / gammaValues.length;
    return +mean.toFixed(3); // Round off to 3 decimal places
  };

  // Calculate Gamma Median for a given alcohol type
  const calculateGammaMedian = (data: Wine[], alcoholType: any) => {
    const filteredData = data.filter((wine) => wine.Alcohol === alcoholType);
    const gammaValues = filteredData.map((wine) =>
      wine.Gamma ? wine.Gamma : 0
    );
    gammaValues.sort((a, b) => a - b);
    const mid = Math.floor(gammaValues.length / 2);
    const median =
      gammaValues.length % 2 !== 0
        ? gammaValues[mid]
        : (gammaValues[mid - 1] + gammaValues[mid]) / 2;
    return +median.toFixed(3); // Round off to 3 decimal places
  };

  // Calculate Gamma Mode for a given alcohol type
  const calculateGammaMode = (data: Wine[], alcoholType: any) => {
    const filteredData = data.filter((wine) => wine.Alcohol === alcoholType);
    const frequencyMap = new Map();
    filteredData.forEach((wine) => {
      const gamma = wine.Gamma ? wine.Gamma : 0;
      frequencyMap.set(gamma, (frequencyMap.get(gamma) || 0) + 1);
    });

    const maxFrequency = Math.max(...frequencyMap.values());
    const modes = Array.from(frequencyMap.entries())
      .filter(([_, freq]) => freq === maxFrequency)
      .map(([val]) => parseFloat(val.toFixed(3)));

    return +modes[0].toFixed(3); // Round off to 3 decimal places
  };

  const gammaAddedWineData = calculateGamma(wineData);

  const uniqueClasses = Array.from(
    new Set(wineData.map((wine) => wine.Alcohol))
  );

  // Render statistics table
  const renderStatistics = () => {
    const rows = ["Mean", "Median", "Mode"].map((statistic) => (
      <tr key={statistic}>
        <td>Gamma {statistic}</td>
        {uniqueClasses.map((classNum) => (
          <td key={`${statistic}-${classNum}`}>
            {calculateStatistic(statistic, classNum)}
          </td>
        ))}
      </tr>
    ));

    return (
      <table>
        <thead>
          <tr>
            <th>Measure</th>
            {uniqueClasses.map((classNum) => (
              <th key={classNum}>Class {classNum}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  // Calculate a specific statistic (Mean, Median, or Mode) for a given alcohol type
  const calculateStatistic = (
    statistic: string,
    alcoholType: number
  ): number => {
    switch (statistic) {
      case "Mean":
        return calculateGammaMean(gammaAddedWineData, alcoholType);
      case "Median":
        return calculateGammaMedian(gammaAddedWineData, alcoholType);
      case "Mode":
        return calculateGammaMode(gammaAddedWineData, alcoholType);
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

export default GammaStatistics;
import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Home, Search, Settings } from 'lucide-react';
import { SystemConnection, PopulationData } from './dataExtraction';

interface StarNetworkVisualizationProps {
  systemConnections: SystemConnection[];
  populationData: PopulationData | null;
  onOpenSetup?: () => void;
}

const StarNetworkVisualization: React.FC<StarNetworkVisualizationProps> = ({
  systemConnections,
  populationData,
  onOpenSetup,
}) => {
  const [systems, setSystems] = useState<{
    nodes: Node[];
    edges: {
      source: number;
      target: number;
      sourceJumpGate: number;
      targetJumpGate: number;
    }[];
  }>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const [hoveredSystem, setHoveredSystem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Node[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  interface NodesMap {
    [key: string]: {
      id: number;
      name: string;
      connections: number;
      connected: number[];
      population: number;
      colonies: { name: string; population: number; bodyName: string }[];
      hasColony: boolean;
    };
  }

  interface Colony {
    name: string;
    bodyName: string;
    population: number;
    controlledBy?: string;
  }

  interface Node {
    x: number;
    y: number;
    depth: number;
    id: number;
    name: string;
    connections: number;
    connected: number[];
    population: number;
    colonies: Colony[];
    hasColony: boolean;
  }

  // Load and prepare data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Process the data to create a proper graph structure
        const graph = processStarData(systemConnections);
        setSystems(graph);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    if (systemConnections.length > 0) {
      loadData();
    }
  }, [systemConnections]);

  // Process star data to create a well-organized graph
  const processStarData = (data: SystemConnection[]) => {
    // Create nodes map for quick access
    const nodesMap: NodesMap = {};
    data.forEach((system) => {
      nodesMap[system.systemId] = {
        id: system.systemId,
        name: system.systemName,
        connections: system.connectionCount,
        connected: [],
        population: 0,
        colonies: [],
        hasColony: false,
      };
    });

    // Populate connections
    data.forEach((system) => {
      system.connectedTo.forEach((connection) => {
        nodesMap[system.systemId].connected.push(connection.systemId);
      });
    });

    // Add population data if available
    if (populationData && populationData.systemDistribution) {
      populationData.systemDistribution.forEach((system) => {
        // Find matching star system
        const matchingSystem = Object.values(nodesMap).find(
          (node) => node.name === system.SystemName
        );

        if (matchingSystem) {
          matchingSystem.population = system.TotalPopulation;
          matchingSystem.colonies = system.Colonies.map((colonyName) => {
            const colony = populationData.colonies.find(
              (c) => c.PopulationName === colonyName
            );
            return {
              name: colonyName,
              population: colony ? colony.Population : 0,
              bodyName: colony ? colony.BodyName : '',
            };
          });
          matchingSystem.hasColony = true;
        }
      });
    }

    // Create a hierarchical layout with Sol at the center
    const layout = createHierarchicalLayout(nodesMap);

    // Create edges from the connections with jump gate information
    const edges: {
      source: number;
      target: number;
      sourceJumpGate: number;
      targetJumpGate: number;
    }[] = [];

    Object.values(nodesMap).forEach((node) => {
      // Find the original star data to get jump gate info
      const starInfo = data.find((s) => s.systemId === node.id);
      if (!starInfo) return;

      starInfo.connectedTo.forEach((connection) => {
        // Add each edge only once (when source id is less than target id)
        if (node.id < connection.systemId) {
          // Find the reverse connection to get the target's jump gate info
          const reverseConnection = data
            .find((s) => s.systemId === connection.systemId)
            ?.connectedTo.find((c) => c.systemId === node.id);

          edges.push({
            source: node.id,
            target: connection.systemId,
            sourceJumpGate: connection.jumpGateRaceId,
            targetJumpGate: reverseConnection?.jumpGateRaceId || 0,
          });
        }
      });
    });

    return {
      nodes: Object.values(layout.nodes),
      edges,
    };
  };

  // Create a hierarchical layout from the network
  const createHierarchicalLayout = (nodesMap: NodesMap) => {
    // Handle single system case
    if (Object.keys(nodesMap).length === 1) {
      const singleNode = Object.values(nodesMap)[0];
      return {
        nodes: {
          [singleNode.id]: {
            ...singleNode,
            x: 0,
            y: 0,
            depth: 0,
          },
        },
        levels: [new Set([singleNode.id])],
      };
    }

    // Find Sol node
    const solNode = Object.values(nodesMap).find((node) => node.name === 'Sol');
    const solId: number = solNode
      ? solNode.id
      : parseInt(Object.keys(nodesMap)[0]);

    // Build levels using BFS
    const visited = new Set<number>([solId]);
    const levels: Set<number>[] = [new Set<number>([solId])];
    const nodeDepth: Record<number, number> = { [solId]: 0 };
    const nodeParent: Record<number, number> = {};

    // Helper function to explore a level
    const exploreLevel = (level: number) => {
      const nextLevel = new Set<number>();

      // Process each node in current level
      Array.from(levels[level]).forEach((nodeId) => {
        const node = nodesMap[nodeId];

        // Add all unvisited neighbors to next level
        node.connected.forEach((neighborId) => {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            nextLevel.add(neighborId);
            nodeDepth[neighborId] = level + 1;
            nodeParent[neighborId] = nodeId;
          }
        });
      });

      if (nextLevel.size > 0) {
        levels.push(nextLevel);
        exploreLevel(level + 1);
      }
    };

    // Start exploration
    exploreLevel(0);

    // Handle any disconnected nodes (should not exist in this dataset but being safe)
    Object.keys(nodesMap).forEach((nodeId) => {
      if (!visited.has(parseInt(nodeId))) {
        const disconnectedLevel = levels.length;
        levels.push(new Set<number>([parseInt(nodeId)]));
        nodeDepth[parseInt(nodeId)] = disconnectedLevel;
      }
    });

    // Create positions for each node
    const nodes: Record<
      number,
      {
        x: number;
        y: number;
        depth: number;
        id: number;
        name: string;
        connections: number;
        connected: number[];
        population: number;
        colonies: Colony[];
        hasColony: boolean;
      }
    > = {};
    const BASE_RADIUS = 100;
    const LEVEL_SPACING = 150;

    // Position Sol at center
    nodes[solId] = {
      ...nodesMap[solId],
      x: 0,
      y: 0,
      depth: 0,
    };

    // Position the rest of the nodes by level
    for (let level = 1; level < levels.length; level++) {
      const nodesInLevel = Array.from(levels[level]);
      const radius = BASE_RADIUS + LEVEL_SPACING * level;

      // Create sectors for better distribution
      const sectors: Record<number, number[]> = {};
      nodesInLevel.forEach((nodeId) => {
        const parentId = nodeParent[nodeId];
        const parentAngle = nodes[parentId]
          ? Math.atan2(nodes[parentId].y, nodes[parentId].x)
          : 0;
        const sectorKey = Math.floor((parentAngle + Math.PI) / (Math.PI / 4));

        if (!sectors[sectorKey]) {
          sectors[sectorKey] = [];
        }
        sectors[sectorKey].push(nodeId);
      });

      // Position nodes within each sector
      Object.entries(sectors).forEach(([sector, sectorNodes]) => {
        const sectorAngle = (parseInt(sector) * Math.PI) / 4 - Math.PI;
        const sectorWidth = Math.PI / 4;
        const nodesCount = sectorNodes.length;

        sectorNodes.forEach((nodeId, index) => {
          const angle =
            sectorAngle +
            (sectorWidth * (index + 0.5)) / Math.max(1, nodesCount);

          nodes[nodeId] = {
            ...nodesMap[nodeId],
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
            depth: level,
          };
        });
      });
    }

    // Apply force-directed adjustments to reduce overlaps
    const adjustedNodes = applyForceDirected(nodes, levels);

    return {
      nodes: adjustedNodes,
      levels,
    };
  };

  // Apply force-directed algorithm to reduce overlaps
  const applyForceDirected = (
    nodes: Record<string, Node>,
    levels: Set<number>[]
  ): Record<string, Node> => {
    // Skip force-directed for single node
    if (Object.keys(nodes).length <= 1) return nodes;

    const NODE_REPULSION = 1000;
    const ITERATIONS = 50;

    // Make a deep copy of nodes to avoid modifying the original
    const adjustedNodes = JSON.parse(JSON.stringify(nodes));

    // Run iterations
    for (let i = 0; i < ITERATIONS; i++) {
      // Calculate repulsive forces between nodes in same and adjacent levels
      for (let level = 1; level < levels.length; level++) {
        const nodesInLevel = Array.from(levels[level]);

        // Apply repulsion between nodes in same level
        for (let a = 0; a < nodesInLevel.length; a++) {
          for (let b = a + 1; b < nodesInLevel.length; b++) {
            const nodeA = adjustedNodes[nodesInLevel[a]];
            const nodeB = adjustedNodes[nodesInLevel[b]];

            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq) || 0.1;

            if (dist < 50) {
              const force = NODE_REPULSION / distSq;
              const forceX = (dx / dist) * force;
              const forceY = (dy / dist) * force;

              nodeA.x -= forceX;
              nodeA.y -= forceY;
              nodeB.x += forceX;
              nodeB.y += forceY;
            }
          }
        }
      }

      // After each iteration, maintain the circular structure
      for (let level = 1; level < levels.length; level++) {
        const nodesInLevel = Array.from(levels[level]);
        const radius = 100 + 150 * level;

        nodesInLevel.forEach((nodeId) => {
          const node = adjustedNodes[nodeId];
          const currentDist = Math.sqrt(node.x * node.x + node.y * node.y);
          const ratio = radius / currentDist;

          node.x *= ratio;
          node.y *= ratio;
        });
      }
    }

    return adjustedNodes;
  };

  // Update SVG dimensions on mount and on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial update
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle mouse wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = transform.scale * delta;
    if (newScale < 0.1 || newScale > 5) return;

    // Get mouse position relative to svg
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate new position to zoom at mouse location
    const newX = mouseX - (mouseX - transform.x) * delta;
    const newY = mouseY - (mouseY - transform.y) * delta;

    setTransform({ x: newX, y: newY, scale: newScale });
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setTransform({
        ...transform,
        x: transform.x + dx,
        y: transform.y + dy,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  // Handle zoom buttons
  const handleZoomIn = () => {
    const newScale = Math.min(transform.scale * 1.2, 5);
    setTransform({ ...transform, scale: newScale });
  };

  const handleZoomOut = () => {
    const newScale = Math.max(transform.scale * 0.8, 0.1);
    setTransform({ ...transform, scale: newScale });
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
    setSelectedSystem(null);
  };

  // Handle system selection
  const handleSystemClick = (systemId: number) => {
    if (selectedSystem === systemId) {
      setSelectedSystem(null);
    } else {
      setSelectedSystem(systemId);
    }
  };

  // Determine node size based on population (if any)
  const getNodeSize = (system: Node) => {
    if (!system.hasColony) return 3; // Base size for systems without colonies

    // Logarithmic scale for population to prevent Sol from being too large
    const baseSize = 4;
    const popLogScale = Math.log10(system.population + 1) * 3;
    return baseSize + popLogScale;
  };

  // Determine node color based on colony status
  const getNodeColor = (system: Node) => {
    if (system.name === 'Sol') return '#FFD700'; // Gold for Sol
    if (system.hasColony) {
      // Check for alien-controlled colonies
      const alienColony = system.colonies.find((colony) => colony.controlledBy);
      if (alienColony) return '#FF00FF'; // Magenta for alien-controlled colonies

      // Color based on population size for human colonies
      if (system.population > 100) return '#FF5733'; // Red for large populations
      if (system.population > 10) return '#FFC300'; // Orange for medium populations
      if (system.population > 1) return '#33A8FF'; // Blue for small populations
      return '#85C1E9'; // Light blue for very small populations
    }
    // Lighter gray for systems without colonies
    return '#9BA5B7';
  };

  // Handle node hover
  const handleMouseEnter = (systemId: number) => {
    setHoveredSystem(systemId);
  };

  const handleMouseLeave = () => {
    setHoveredSystem(null);
  };

  // Find connected systems to a given system
  const getConnectedSystems = (systemId: number) => {
    if (!systems.nodes) return [];

    const node = systems.nodes.find((n: Node) => n.id === systemId);
    if (!node) return [];

    return node.connected
      .map((connId: number) => systems.nodes.find((n: Node) => n.id === connId))
      .filter((node): node is Node => node !== undefined);
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (!e.target.value.trim()) {
      setSearchResults([]);
      return;
    }

    const term = e.target.value.toLowerCase();
    const results = systems.nodes
      ? systems.nodes
          .filter((node: Node) => node.name.toLowerCase().includes(term))
          .slice(0, 5)
      : [];

    setSearchResults(results);
  };

  const handleSearchSelect = (systemId: number) => {
    setSelectedSystem(systemId);
    setSearchTerm('');
    setSearchResults([]);
    setShowSearch(false);

    // Center the view on the selected system
    const node = systems.nodes.find((n: Node) => n.id === systemId);
    if (node) {
      setTransform({
        x: -node.x * transform.scale + dimensions.width / 2,
        y: -node.y * transform.scale + dimensions.height / 2,
        scale: transform.scale,
      });
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-xl'>Loading star systems...</div>
      </div>
    );
  }

  // Handle case where no systems are loaded
  if (!systems.nodes || systems.nodes.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-xl'>No star systems found</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className='relative w-full h-screen bg-gray-900 overflow-hidden'
    >
      {/* Controls */}
      <div className='absolute top-4 right-4 z-10 flex flex-col gap-2'>
        <button
          className='bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700'
          onClick={handleZoomIn}
        >
          <ZoomIn size={20} />
        </button>
        <button
          className='bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700'
          onClick={handleZoomOut}
        >
          <ZoomOut size={20} />
        </button>
        <button
          className='bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700'
          onClick={handleReset}
        >
          <Home size={20} />
        </button>
        <button
          className='bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700'
          onClick={toggleSearch}
        >
          <Search size={20} />
        </button>
        {onOpenSetup && (
          <button
            className='bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700'
            onClick={onOpenSetup}
            title='Change game/race selection or upload new database'
          >
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* Search panel */}
      {showSearch && (
        <div className='absolute top-4 left-4 z-10 bg-gray-800 bg-opacity-90 text-white p-4 rounded-lg w-64'>
          <input
            type='text'
            placeholder='Search star systems...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-full bg-gray-700 text-white px-3 py-2 rounded-md mb-2'
          />
          {searchResults.length > 0 && (
            <ul className='bg-gray-700 rounded-md overflow-hidden'>
              {searchResults.map((result) => (
                <li
                  key={result.id}
                  className='px-3 py-2 hover:bg-gray-600 cursor-pointer'
                  onClick={() => handleSearchSelect(result.id)}
                >
                  {result.name} ({result.connections} connections)
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Info panel */}
      {selectedSystem && (
        <div className='absolute top-4 left-4 z-10 bg-gray-800 bg-opacity-90 text-white p-4 rounded-lg max-w-xs'>
          {systems.nodes &&
            (() => {
              const system = systems.nodes.find(
                (n: Node) => n.id === selectedSystem
              );
              if (!system) return null;

              return (
                <>
                  <h3 className='text-lg font-bold mb-2'>{system.name}</h3>
                  <p className='mb-1'>System ID: {system.id}</p>
                  <p className='mb-1'>Connections: {system.connections}</p>

                  {system.hasColony && (
                    <>
                      <p className='mb-2'>
                        <span className='font-semibold'>Total Population:</span>{' '}
                        {system.population.toFixed(2)} million
                      </p>

                      <h4 className='font-semibold mt-2 mb-1'>Colonies:</h4>
                      <ul className='list-disc list-inside'>
                        {system.colonies.map((colony, index) => (
                          <li key={index} className='text-sm mb-1'>
                            <span className='font-medium'>{colony.name}</span>
                            {colony.bodyName && ` (${colony.bodyName})`}:{' '}
                            {colony.population.toFixed(2)} million
                            {colony.controlledBy && (
                              <span className='text-purple-400'>
                                {' '}
                                - Controlled by {colony.controlledBy}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <h4 className='font-semibold mt-3 mb-1'>Connected to:</h4>
                  <ul className='list-disc list-inside'>
                    {getConnectedSystems(selectedSystem).map(
                      (connectedSystem) => (
                        <li key={connectedSystem.id} className='text-sm'>
                          {connectedSystem.name}
                          {connectedSystem.hasColony &&
                            ` (Pop: ${connectedSystem.population.toFixed(1)})`}
                        </li>
                      )
                    )}
                  </ul>
                </>
              );
            })()}
        </div>
      )}

      {/* Star map */}
      <svg
        ref={svgRef}
        className='w-full h-full cursor-move'
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ display: 'block' }}
      >
        <defs>
          <radialGradient
            id='star-glow'
            cx='50%'
            cy='50%'
            r='50%'
            fx='50%'
            fy='50%'
          >
            <stop offset='0%' stopColor='white' stopOpacity='1' />
            <stop offset='100%' stopColor='white' stopOpacity='0' />
          </radialGradient>

          {/* Jump gate gradients */}
          <linearGradient id='jumpGateGradient' gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor='#FFA500' stopOpacity='0.8' />
            <stop offset='100%' stopColor='#FFA500' stopOpacity='0.8' />
          </linearGradient>

          <linearGradient id='normalGradient' gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor='#8B95A5' stopOpacity='0.8' />
            <stop offset='100%' stopColor='#8B95A5' stopOpacity='0.8' />
          </linearGradient>
        </defs>

        <g
          transform={`translate(${dimensions.width / 2 + transform.x}, ${
            dimensions.height / 2 + transform.y
          }) scale(${transform.scale})`}
        >
          {/* Concentric circles showing levels */}
          {systems.nodes &&
            Array.from(new Set(systems.nodes.map((node) => node.depth)))
              .sort()
              .map(
                (depth) =>
                  depth > 0 && (
                    <circle
                      key={`level-${depth}`}
                      cx={0}
                      cy={0}
                      r={100 + 150 * depth}
                      fill='none'
                      stroke='#4A5F82'
                      strokeWidth={1}
                      strokeDasharray='5,5'
                      opacity={0.7}
                    />
                  )
              )}

          {/* Jump connections */}
          {systems.edges &&
            systems.edges.map((edge, i) => {
              const sourceNode = systems.nodes.find(
                (n: Node) => n.id === edge.source
              );
              const targetNode = systems.nodes.find(
                (n: Node) => n.id === edge.target
              );

              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                selectedSystem &&
                (edge.source === selectedSystem ||
                  edge.target === selectedSystem);

              const x1 = sourceNode.x;
              const y1 = sourceNode.y;
              const x2 = targetNode.x;
              const y2 = targetNode.y;

              // Determine if we have jump gates
              const hasSourceJumpGate = edge.sourceJumpGate > 0;
              const hasTargetJumpGate = edge.targetJumpGate > 0;
              const hasBothJumpGates = hasSourceJumpGate && hasTargetJumpGate;

              // Create unique gradient ID for this edge
              const gradientId = `jumpLineGradient-${i}`;

              return (
                <g key={`edge-${i}`}>
                  <linearGradient
                    id={gradientId}
                    gradientUnits='userSpaceOnUse'
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                  >
                    {hasBothJumpGates ? (
                      // Both ends have jump gates - solid orange
                      <>
                        <stop
                          offset='0%'
                          stopColor='#FFA500'
                          stopOpacity='0.8'
                        />
                        <stop
                          offset='100%'
                          stopColor='#FFA500'
                          stopOpacity='0.8'
                        />
                      </>
                    ) : hasSourceJumpGate ? (
                      // Only source has jump gate - orange to grey
                      <>
                        <stop
                          offset='0%'
                          stopColor='#FFA500'
                          stopOpacity='0.8'
                        />
                        <stop
                          offset='45%'
                          stopColor='#FFA500'
                          stopOpacity='0.8'
                        />
                        <stop
                          offset='55%'
                          stopColor='#8B95A5'
                          stopOpacity='0.8'
                        />
                        <stop
                          offset='100%'
                          stopColor='#8B95A5'
                          stopOpacity='0.8'
                        />
                      </>
                    ) : hasTargetJumpGate ? (
                      // Only target has jump gate - grey to orange
                      <>
                        <stop
                          offset='0%'
                          stopColor='#8B95A5'
                          stopOpacity='0.8'
                        />
                        <stop
                          offset='45%'
                          stopColor='#8B95A5'
                          stopOpacity='0.8'
                        />
                        <stop
                          offset='55%'
                          stopColor='#FFA500'
                          stopOpacity='0.8'
                        />
                        <stop
                          offset='100%'
                          stopColor='#FFA500'
                          stopOpacity='0.8'
                        />
                      </>
                    ) : (
                      // No jump gates - normal grey
                      <>
                        <stop
                          offset='0%'
                          stopColor='#8B95A5'
                          stopOpacity='0.8'
                        />
                        <stop
                          offset='100%'
                          stopColor='#8B95A5'
                          stopOpacity='0.8'
                        />
                      </>
                    )}
                  </linearGradient>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={`url(#${gradientId})`}
                    strokeWidth={isHighlighted ? 1.5 : 0.8}
                  />
                </g>
              );
            })}

          {/* Star systems */}
          {systems.nodes &&
            systems.nodes.map((system) => {
              const isSelected = selectedSystem === system.id;
              const isConnected =
                selectedSystem &&
                getConnectedSystems(selectedSystem).some(
                  (s) => s.id === system.id
                );
              const isHovered = hoveredSystem === system.id;
              const highlight = isSelected || isConnected || isHovered;

              return (
                <g
                  key={system.id}
                  transform={`translate(${system.x}, ${system.y})`}
                  onClick={() => handleSystemClick(system.id)}
                  onMouseEnter={() => handleMouseEnter(system.id)}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glow effect for systems with colonies */}
                  {system.hasColony && (
                    <circle
                      r={getNodeSize(system) * 2.5}
                      fill='url(#star-glow)'
                      opacity={highlight ? 0.7 : 0.3}
                    />
                  )}

                  {/* The star system */}
                  <circle
                    r={getNodeSize(system)}
                    fill={getNodeColor(system)}
                    stroke={highlight ? '#FFFFFF' : 'transparent'}
                    strokeWidth={1.5}
                  />

                  {/* System name and population if it has colonies */}
                  <text
                    dy={-getNodeSize(system) - 8}
                    textAnchor='middle'
                    fill={
                      highlight
                        ? '#FFFFFF'
                        : system.hasColony
                        ? '#B2B9C5'
                        : '#B2B9C5'
                    }
                    fontSize={highlight ? 12 : 10}
                    fontWeight={highlight ? 'bold' : 'normal'}
                    style={{
                      textShadow:
                        '0 0 3px #000, 0 0 3px #000, 0 0 3px #000, 0 0 3px #000',
                    }}
                  >
                    {system.name}
                    {system.hasColony
                      ? ` (${system.population.toFixed(1)})`
                      : ''}
                  </text>
                </g>
              );
            })}
        </g>
      </svg>

      {/* Tooltip for hovered system */}
      {hoveredSystem && !selectedSystem && systems.nodes && (
        <div
          className='absolute bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded text-sm z-20 pointer-events-none'
          style={{
            left:
              (systems.nodes.find((n: Node) => n.id === hoveredSystem)?.x ??
                0) *
                transform.scale +
              dimensions.width / 2 +
              transform.x +
              'px',
            top:
              (systems.nodes.find((n: Node) => n.id === hoveredSystem)?.y ??
                0) *
                transform.scale +
              dimensions.height / 2 +
              transform.y -
              30 +
              'px',
          }}
        >
          {(() => {
            const system = systems.nodes.find(
              (n: Node) => n.id === hoveredSystem
            );
            if (!system) return '';

            let tooltip = system.name;
            if (system.hasColony) {
              tooltip += ` - Population: ${system.population.toFixed(
                1
              )} million`;
              tooltip += ` - Colonies: ${system.colonies.length}`;
            }
            return tooltip;
          })()}
        </div>
      )}

      {/* Legend */}
      <div className='absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 text-white text-xs p-2 rounded-lg'>
        <div className='mb-1 font-semibold text-sm'>Legend:</div>
        <div className='flex items-center mb-1'>
          <div
            className='w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: '#FFD700' }}
          ></div>
          <span>Sol (1541.18 million)</span>
        </div>
        <div className='flex items-center mb-1'>
          <div
            className='w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: '#FF00FF' }}
          ></div>
          <span>Alien-Controlled Colony</span>
        </div>
        <div className='flex items-center mb-1'>
          <div
            className='w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: '#FF5733' }}
          ></div>
          <span>Large Colony (&gt;100 million)</span>
        </div>
        <div className='flex items-center mb-1'>
          <div
            className='w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: '#FFC300' }}
          ></div>
          <span>Medium Colony (10-100 million)</span>
        </div>
        <div className='flex items-center mb-1'>
          <div
            className='w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: '#33A8FF' }}
          ></div>
          <span>Small Colony (1-10 million)</span>
        </div>
        <div className='flex items-center mb-1'>
          <div
            className='w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: '#85C1E9' }}
          ></div>
          <span>Minor Colony (&lt;1 million)</span>
        </div>
        <div className='flex items-center mb-1'>
          <div
            className='w-3 h-3 rounded-full mr-2'
            style={{ backgroundColor: '#9BA5B7' }}
          ></div>
          <span>Uninhabited System</span>
        </div>

        {/* Jump gate connection legend entries */}
        <div className='mt-2 mb-1 font-semibold text-sm'>Connections:</div>
        <div className='flex items-center mb-1'>
          <div className='w-12 h-0.5 mr-2 bg-[#FFA500]'></div>
          <span>Jump Gate Connection</span>
        </div>
        <div className='flex items-center mb-1'>
          <div
            className='w-12 h-0.5 mr-2'
            style={{
              background: 'linear-gradient(to right, #FFA500 45%, #8B95A5 55%)',
            }}
          ></div>
          <span>Single Jump Gate</span>
        </div>
        <div className='flex items-center mb-1'>
          <div className='w-12 h-0.5 mr-2 bg-[#8B95A5]'></div>
          <span>Normal Connection</span>
        </div>
      </div>
    </div>
  );
};

export default StarNetworkVisualization;

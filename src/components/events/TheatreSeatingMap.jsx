'use client';

import { useState, useMemo, useEffect } from 'react';

export default function TheatreSeatingMap({ seats = [] }) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Organize seats by row
  const seatsByRow = useMemo(() => {
    const grouped = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      grouped[seat.row].push(seat);
    });

    return Object.keys(grouped)
      .sort()
      .reduce((acc, row) => {
        acc[row] = grouped[row].sort((a, b) => a.column - b.column);
        return acc;
      }, {});
  }, [seats]);

  // Get unique seat types for filter
  const seatTypes = useMemo(() => {
    const types = new Set(seats.map((s) => s.type));
    return Array.from(types).sort();
  }, [seats]);

  // Get seat type colors
  const getTypeColor = (type) => {
    const colorMap = {
      standard: '#6366f1',
      vip: '#f59e0b',
      premium: '#ec4899',
      wheelchair: '#8b5cf6',
      couple: '#06b6d4',
    };
    return colorMap[type?.toLowerCase()] || '#6366f1';
  };

  const maxColumn = useMemo(() => {
    return Math.max(...Object.values(seatsByRow).flat().map((s) => s.column));
  }, [seatsByRow]);

  const handleSeatClick = (seat) => {
    if (seat.bookingStatus === 'available') {
      setSelectedSeat(seat);
    }
  };

  const formatPrice = (price) => {
    return `LKR ${Number(price).toLocaleString()}`;
  };

  const stats = {
    available: seats.filter((s) => s.bookingStatus === 'available').length,
    booked: seats.filter((s) => s.bookingStatus !== 'available').length,
    total: seats.length,
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-filter-dropdown]')) {
        setShowFilterDropdown(false);
      }
    };
    
    if (showFilterDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showFilterDropdown]);

  return (
    <div className="space-y-8">
      {/* Filter */}
      {seatTypes.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-white/70 font-medium">
            Filter:
          </label>
          <div className="relative" data-filter-dropdown>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm hover:border-white/20 focus:outline-none focus:border-[#4a9fd8] transition-colors flex items-center justify-between w-40"
            >
              <span>{filterType === 'all' ? 'All Types' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 w-40 rounded-lg bg-[#0f0f14] border border-white/20 shadow-lg z-50">
                <button
                  onClick={() => {
                    setFilterType('all');
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white first:rounded-t-lg transition-colors"
                >
                  All Types
                </button>
                {seatTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setShowFilterDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seating Grid */}
      <div className="space-y-4 flex flex-col items-center">
        <div className="text-center text-xs text-white/50 font-medium uppercase tracking-wide mb-6">
          SCREEN
        </div>
        
        <div className="space-y-3">
          {Object.entries(seatsByRow).map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-4 justify-center">
              <div className="w-8 text-center">
                <span className="text-xs font-semibold text-white/50 uppercase">{row}</span>
              </div>

              <div className="flex justify-center">
                <div className="inline-flex gap-2 pb-2">
                  {Array.from({ length: maxColumn }).map((_, colIndex) => {
                    const seat = rowSeats.find((s) => s.column === colIndex + 1);

                    // Aisle space
                    if ((colIndex + 1) % 4 === 0 && colIndex !== maxColumn - 1) {
                      return <div key={`aisle-${row}-${colIndex}`} className="w-3 flex-shrink-0" />;
                    }

                    // Empty seat
                    if (!seat) {
                      return (
                        <div
                          key={`empty-${row}-${colIndex}`}
                          className="w-8 h-8 flex-shrink-0"
                        />
                      );
                    }

                    // Apply filter opacity
                    if (filterType !== 'all' && seat.type.toLowerCase() !== filterType.toLowerCase()) {
                      return (
                        <button
                          key={seat.seatNumber}
                          disabled
                          className="w-8 h-8 flex-shrink-0 rounded-md bg-white/5 opacity-30 cursor-default text-xs font-bold text-white/30 flex items-center justify-center"
                        >
                          {seat.column}
                        </button>
                      );
                    }

                    const isAvailable = seat.bookingStatus === 'available';
                    const isSelected = selectedSeat?.seatNumber === seat.seatNumber;

                    return (
                      <button
                        key={seat.seatNumber}
                        onClick={() => handleSeatClick(seat)}
                        disabled={!isAvailable}
                        title={`${seat.seatNumber} - ${seat.type} - ${formatPrice(seat.price)}`}
                        className={`w-8 h-8 flex-shrink-0 rounded-md text-xs font-bold transition-all flex items-center justify-center ${
                          !isAvailable
                            ? 'bg-red-500/30 border border-red-500/50 text-red-400/60 cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#206eaa] border border-[#4a9fd8] text-white shadow-lg shadow-[#206eaa]/40 scale-110'
                              : 'bg-green-500/30 border border-green-500/40 text-green-700 hover:bg-green-500/40 cursor-pointer'
                        }`}
                      >
                        {seat.column}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 grid gap-6 lg:grid-cols-2">
        {/* Legend & Stats */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 font-bold mb-4">Seat Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-green-500/30 border border-green-500/40" />
                <span className="text-white/70">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-red-500/30 border border-red-500/50" />
                <span className="text-white/70">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#206eaa] border border-[#4a9fd8]" />
                <span className="text-white/70">Selected</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 font-bold mb-4">Types</h4>
            <div className="space-y-2 text-sm">
              {seatTypes.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getTypeColor(type) }}
                  />
                  <span className="text-white/70 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs uppercase tracking-wider text-white/50 font-bold mb-3">Availability</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">{stats.available}</div>
                <div className="text-xs text-white/50 mt-1">Available</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-red-400">{stats.booked}</div>
                <div className="text-xs text-white/50 mt-1">Booked</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-[#4a9fd8]">{stats.total}</div>
                <div className="text-xs text-white/50 mt-1">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Seat Info */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-fit">
          {selectedSeat ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">{selectedSeat.seatNumber}</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wide font-bold">Type</div>
                  <p className="text-white/80 font-medium capitalize">{selectedSeat.type}</p>
                </div>
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wide font-bold">Price</div>
                  <p className="text-[#4a9fd8] font-bold text-lg">{formatPrice(selectedSeat.price)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wide font-bold">Row</div>
                    <p className="text-white/80 font-medium">{selectedSeat.row}</p>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wide font-bold">Col</div>
                    <p className="text-white/80 font-medium">{selectedSeat.column}</p>
                  </div>
                </div>
              </div>

              {selectedSeat.features && selectedSeat.features.length > 0 && (
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wide font-bold mb-2">Features</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSeat.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-[#206eaa]/20 text-[#4a9fd8] border border-[#206eaa]/40"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full mt-4 px-4 py-2 bg-[#206eaa] hover:bg-[#1a5a8f] text-white font-medium rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60 text-sm">Select a seat to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

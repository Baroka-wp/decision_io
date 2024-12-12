import React from 'react';

const ProgressBar = ({ progress }) => {
    const isComplete = progress === 100;

    return (
        <div className="w-full max-w-4xl mx-auto mb-2 px-4 sm:px-6 lg:px-8">
            <div className="relative pt-2">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs sm:text-sm font-semibold inline-block text-[#6A5ACD]">
                            {progress.toFixed(0)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 sm:h-3 mb-4 text-xs flex rounded bg-[#6A5ACD]/20">
                    <div
                        style={{ width: `${progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#6A5ACD] transition-all duration-500 ease-out"
                    ></div>
                </div>
                {isComplete && (
                    <div className="text-center text-[#6A5ACD] font-semibold animate-pulse text-sm sm:text-base">
                        Analyse des réponses en cours...
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressBar;
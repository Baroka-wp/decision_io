import React from 'react';

const ProgressBar = ({ progress }) => {
    const isComplete = progress === 100;

    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
            <div className="relative pt-4">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs sm:text-sm font-semibold inline-block text-fuschia-600">
                            {progress.toFixed(0)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 sm:h-3 mb-4 text-xs flex rounded bg-fuschia-200">
                    <div
                        style={{ width: `${progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-fuschia-500 transition-all duration-500 ease-out"
                    ></div>
                </div>
                {isComplete && (
                    <div className="text-center text-fuschia-600 font-semibold animate-pulse text-sm sm:text-base">
                        Analyse des réponses en cours...
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressBar;
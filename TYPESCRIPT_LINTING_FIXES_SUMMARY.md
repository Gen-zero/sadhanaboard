PS D:\sadhanaboard> npm run dev

> saadhanaboard@0.0.0 dev
> npm run dev:setup && vite


> saadhanaboard@0.0.0 dev:setup
> node scripts/ensure-theme-assets.js && node scripts/generate-theme-manifest.cjs && node scripts/copy-theme-icons.cjs && node scripts/move-assets.js && node scripts/copy-all-theme-assets.js

Theme assets up to date

  VITE v7.1.12  ready in 1774 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://10.101.70.118:8080/
  ➜  press h + enter to show help

 *  History restored 

PS D:\sadhanaboard> npm run lint

> saadhanaboard@0.0.0 lint
> eslint .


D:\sadhanaboard\scripts\optimize-images.cjs
  14:1  error  Parsing error: 'import' and 'export' may appear only with 'sourceType: module'

D:\sadhanaboard\sdk\index.d.ts
  103:39  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  103:53  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  115:53  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  124:35  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  125:37  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  126:70  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  127:70  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  128:43  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  138:55  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  139:52  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  142:23  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  143:23  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\components\EditProfileModal.tsx
  151:21  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                  @typescript-eslint/no-explicit-any
  185:19  error    Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                   
                  jsx-a11y/click-events-have-key-events
  185:19  error    Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions

D:\sadhanaboard\src\components\EnhancedDashboard.tsx
  219:6  warning  React Hook useEffect has missing dependencies: 'loadStats', 'loadTasks', and 'withLoading'. Either include them or remove the dependency array  react-hooks/exhaustive-deps       

D:\sadhanaboard\src\components\Layout.tsx
  114:6   warning  React Hook useEffect has a missing dependency: 'hinduMantras.length'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  293:21  error    Visible, non-interactive elements with click handlers must have at least one keyboard listener                          jsx-a11y/click-events-have-key-events
  293:21  error    Non-interactive elements should not be assigned mouse or keyboard event listeners                                       jsx-a11y/no-noninteractive-element-interactions
  310:19  error    Non-interactive elements should not be assigned interactive roles              
                                         jsx-a11y/no-noninteractive-element-to-interactive-role   

D:\sadhanaboard\src\components\MahakaliAnimatedBackground.tsx
  118:6  warning  React Hook useEffect has a missing dependency: 'texture'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\components\ProfileCard.tsx
  39:50  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\Saadhanas.tsx
  166:19  error  A form label must be associated with a control  jsx-a11y/label-has-associated-control
  192:17  error  A form label must be associated with a control  jsx-a11y/label-has-associated-control

D:\sadhanaboard\src\components\Settings.tsx
   75:18  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  428:19  error    A form label must have accessible text    jsx-a11y/label-has-associated-control

D:\sadhanaboard\src\components\ShadowSelfMonitor.tsx
  56:6  warning  React Hook useEffect has missing dependencies: 'higherSelfPrompts' and 'shadowPrompts'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\components\SmoothScroll.tsx
  48:40  error    Use the rest parameters instead of 'arguments'  prefer-rest-params
  48:53  warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any

D:\sadhanaboard\src\components\ThemeDebugger.tsx
   6:46  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  35:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  47:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\ThemePanel.tsx
   37:52   warning  Unexpected any. Specify a different type                                      
                                   @typescript-eslint/no-explicit-any
   39:6    warning  React Hook useEffect has a missing dependency: 'themeOptions'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
   49:101  warning  Unexpected any. Specify a different type                                      
                                   @typescript-eslint/no-explicit-any
   51:43   warning  Unexpected any. Specify a different type                                      
                                   @typescript-eslint/no-explicit-any
   69:49   warning  Unexpected any. Specify a different type                                      
                                   @typescript-eslint/no-explicit-any
  119:62   warning  Unexpected any. Specify a different type                                      
                                   @typescript-eslint/no-explicit-any

D:\sadhanaboard\src\components\ThemeProvider.tsx
   17:52   warning  React Hook useMemo has a missing dependency: 'settings'. Either include it or remove the dependency array            react-hooks/exhaustive-deps
  147:64   warning  Unexpected any. Specify a different type                                      
                                       @typescript-eslint/no-explicit-any
  175:49   warning  Unexpected any. Specify a different type                                      
                                       @typescript-eslint/no-explicit-any
  175:103  warning  Unexpected any. Specify a different type                                      
                                       @typescript-eslint/no-explicit-any
  178:55   warning  Unexpected any. Specify a different type                                      
                                       @typescript-eslint/no-explicit-any
  183:6    warning  React Hook useEffect has a missing dependency: 'memoizedSettings'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\components\ThemedBackground.tsx
     7:79  warning  Unexpected any. Specify a different type      @typescript-eslint/no-explicit-any
  1475:20  warning  Unexpected any. Specify a different type      @typescript-eslint/no-explicit-any
  1476:28  warning  Unexpected any. Specify a different type      @typescript-eslint/no-explicit-any
  1524:11  error    Unexpected lexical declaration in case block  no-case-declarations
  1625:11  error    Unexpected lexical declaration in case block  no-case-declarations
  1707:11  error    Unexpected lexical declaration in case block  no-case-declarations
  2144:21  error    Unexpected lexical declaration in case block  no-case-declarations
  2532:11  error    Unexpected lexical declaration in case block  no-case-declarations

D:\sadhanaboard\src\components\UnlockedSadhanas.tsx
  64:17  error  Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                      
               jsx-a11y/click-events-have-key-events
  64:17  error  Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions

D:\sadhanaboard\src\components\analytics\AnalyticsExportPanel.tsx
  3:46  error  Unexpected empty object pattern                                                    
                                                                                                  
                                                                                                  
                                                                                                  
  no-empty-pattern
  3:50  error  The `{}` ("empty object") type allows any non-nullish value, including literals like `0` and `""`.
- If that's what you want, disable this lint rule with an inline comment or configure the 'allowObjectTypes' rule option.
- If you want a type meaning "any object", you probably want `object` instead.
- If you want a type meaning "any value", you probably want `unknown` instead  @typescript-eslint/no-empty-object-type

D:\sadhanaboard\src\components\analytics\ComparativeAnalyticsChart.tsx
  4:70  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\components\analytics\CompletionRatesChart.tsx
  4:70  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\components\analytics\PracticeHeatmapCalendar.tsx
  3:68  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\components\analytics\PracticeTrendsChart.tsx
  4:69  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\components\analytics\StreakChart.tsx
  3:56  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\components\cms\AssetManager.tsx
   8:18  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  12:17  error    A `require()` style import is forbidden   @typescript-eslint/no-require-imports 
  14:24  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  21:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  22:58  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  33:17  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\cms\LibraryAnalyticsDashboard.tsx
  16:17  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\cms\SpiritualLibraryManager.tsx
   40:19   warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
   96:48   warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  100:102  warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  101:97   warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  106:19   warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  123:19   warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  137:19   warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  180:17   error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  198:17   error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  208:17   error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  284:48   warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any

D:\sadhanaboard\src\components\cms\TemplateBuilder.tsx
   8:17  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
   8:39  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
   8:55  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  11:15  error    A `require()` style import is forbidden   @typescript-eslint/no-require-imports 
  12:20  error    A `require()` style import is forbidden   @typescript-eslint/no-require-imports 
  15:15  error    A `require()` style import is forbidden   @typescript-eslint/no-require-imports 
  19:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  24:48  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  33:28  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\cms\ThemeStudio.tsx
  54:13  error  A form label must be associated with a control  jsx-a11y/label-has-associated-control
  58:13  error  A form label must be associated with a control  jsx-a11y/label-has-associated-control
  62:13  error  A form label must be associated with a control  jsx-a11y/label-has-associated-control

D:\sadhanaboard\src\components\deity\DeityEssence.tsx
  22:29  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\error\ErrorBoundary.tsx
  234:17  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components
  250:17  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\components\error\ErrorMessage.tsx
  44:28  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\forms\EnhancedFormField.tsx
  254:62  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  261:28  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  331:69  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\components\forms\EnhancedValidationDemo.tsx
  49:15  error  Unnecessary escape character: \+  no-useless-escape

D:\sadhanaboard\src\components\forms\ValidationDemo.tsx
   47:15  error    Unnecessary escape character: \+          no-useless-escape
  473:51  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\components\library\AdvancedFilters.tsx
  251:11  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  294:11  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  309:11  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  310:38  warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  323:11  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  324:38  warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  339:11  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  340:38  warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  352:11  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  401:37  warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any

D:\sadhanaboard\src\components\library\BookShelf.tsx
  233:5  error  Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                      
               jsx-a11y/click-events-have-key-events
  233:5  error  Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions

D:\sadhanaboard\src\components\library\FilterChips.tsx
  10:41  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  16:63  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\library\RecommendedRow.tsx
  59:45  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  59:64  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  67:66  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  94:60  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\library\SearchBar.tsx
  135:15  error  Visible, non-interactive elements with click handlers must have at least one keyboard listener  jsx-a11y/click-events-have-key-events

D:\sadhanaboard\src\components\library\upload\BatchMetadataEditor.tsx
  27:68  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\library\upload\BookEditForm.tsx
   99:19  warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  129:13  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control

D:\sadhanaboard\src\components\library\upload\BookRequestForm.tsx
   94:21  warning  Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  115:13  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  125:13  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  135:13  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  165:13  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control
  176:13  error    A form label must be associated with a control  jsx-a11y/label-has-associated-control

D:\sadhanaboard\src\components\library\upload\BookUploadForm.tsx
  65:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  91:64  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  98:46  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\library\upload\BulkUploadDialog.tsx
   57:9   error    Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions
   58:21  warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
   79:9   error    Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions
   80:21  warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
   95:22  warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
  111:9   error    Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions
  112:21  warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
  193:67  warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any

D:\sadhanaboard\src\components\library\upload\MultiFileUpload.tsx
  36:42  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  36:71  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\loading\LoadingDemo.tsx
  62:41  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\loading\LoadingForm.tsx
  307:7   error    Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                   
                  jsx-a11y/click-events-have-key-events
  307:7   error    Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions
  406:21  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                  @typescript-eslint/no-explicit-any

D:\sadhanaboard\src\components\mobile\MobileFormComponents.tsx
  359:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\components\mobile\MobileNav.tsx
  98:9  error  Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                       
              jsx-a11y/click-events-have-key-events
  98:9  error  Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions

D:\sadhanaboard\src\components\mobile\MobileTestSuite.tsx
  240:6  warning  React Hook useEffect has a missing dependency: 'runAllTests'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\components\mobile\PullToRefresh.tsx
  89:6  warning  React Hook useEffect has missing dependencies: 'handleTouchEnd', 'handleTouchMove', and 'handleTouchStart'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\components\navigation\BottomNavigationBar.tsx
  16:29  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\navigation\DesktopNavigation.tsx
  98:13  error  Visible, non-interactive elements with click handlers must have at least one keyboard listener  jsx-a11y/click-events-have-key-events
  98:13  error  Non-interactive elements should not be assigned mouse or keyboard event listeners 
              jsx-a11y/no-noninteractive-element-interactions

D:\sadhanaboard\src\components\sadhana\AnimatedParchment.tsx
  32:6  warning  React Hook useEffect has missing dependencies: 'isBurning' and 'startBurningAnimation'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\components\sadhana\PaperScroll2D.tsx
  13:5  error  Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                       
              jsx-a11y/click-events-have-key-events
  13:5  error  Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions

D:\sadhanaboard\src\components\sadhana\SadhanaComments.tsx
   7:44  warning  Unexpected any. Specify a different type                                        
                          @typescript-eslint/no-explicit-any
  23:33  warning  React Hook useEffect has a missing dependency: 'fetch'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\components\settings\AccessibilitySettings.tsx
  16:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\settings\AdvancedSettings.tsx
  16:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\settings\AppearanceSettings.tsx
   34:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  124:45  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  136:44  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  137:47  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  138:62  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  157:70  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  198:45  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  210:44  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  211:47  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  212:62  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  231:70  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\components\settings\GeneralSettings.tsx
  29:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\settings\MeditationSettings.tsx
  17:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\settings\NotificationsSettings.tsx
  17:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\settings\PrivacySettings.tsx
  18:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\settings\ProfileSettings.tsx
   45:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  182:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\components\settings\ProfileVisibilitySettings.tsx
  16:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\components\ui\EnhancedTooltip.tsx
  151:7  error  Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                      
               jsx-a11y/click-events-have-key-events
  151:7  error  Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions

D:\sadhanaboard\src\components\ui\alert.tsx
  39:3  error  Headings must have content and the content must be accessible by a screen reader  jsx-a11y/heading-has-content

D:\sadhanaboard\src\components\ui\badge.tsx
  41:17  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\components\ui\button.tsx
  69:18  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\components\ui\card.tsx
  52:3  error  Headings must have content and the content must be accessible by a screen reader  jsx-a11y/heading-has-content

D:\sadhanaboard\src\components\ui\command.tsx
  24:11  error  An interface declaring no members is equivalent to its supertype  @typescript-eslint/no-empty-object-type

D:\sadhanaboard\src\components\ui\form.tsx
  168:3  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\components\ui\navigation-menu.tsx
  119:3  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\components\ui\pagination.tsx
  48:3  error  Anchors must have content and the content must be accessible by a screen reader  jsx-a11y/anchor-has-content

D:\sadhanaboard\src\components\ui\sidebar.tsx
  764:3  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\components\ui\textarea.tsx
  5:18  error  An interface declaring no members is equivalent to its supertype  @typescript-eslint/no-empty-object-type

D:\sadhanaboard\src\components\ui\toggle.tsx
  43:18  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\contexts\HelpContext.tsx
  248:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

D:\sadhanaboard\src\hooks\useAccessibility.ts
  149:8  warning  React Hook useEffect has an unnecessary dependency: 'prefersReducedMotion'. Either exclude it or remove the dependency array. Outer scope values like 'prefersReducedMotion' aren't valid dependencies because mutating them doesn't re-render the component  react-hooks/exhaustive-deps

D:\sadhanaboard\src\hooks\useAdvancedSettings.ts
  6:52  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     
  7:50  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     
  8:44  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     
  9:52  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\hooks\useAuth.ts
   72:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   95:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  116:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\hooks\useBIReports.ts
   41:28  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   71:12  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   71:59  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   72:12  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   77:12  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   81:14  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  102:66  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  108:65  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  113:53  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\hooks\useDailySadhanaRefresh.ts
  28:65  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  95:59  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\hooks\useEnhancedUserManagement.ts
  22:45  warning  React Hook useEffect has a missing dependency: 'load'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\hooks\useFormValidation.tsx
    8:10  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   43:60  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   53:67  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   73:12  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   95:9   error    Unnecessary try/catch wrapper             no-useless-catch
   98:44  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  219:63  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  352:25  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\hooks\useLoadingState.tsx
   14:27  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                                                                                      @typescript-eslint/no-explicit-any
   16:38  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                                                                                      @typescript-eslint/no-explicit-any
   17:32  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                                                                                      @typescript-eslint/no-explicit-any
   68:46  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                                                                                      @typescript-eslint/no-explicit-any
   70:38  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                                                                                      @typescript-eslint/no-explicit-any
   86:19  warning  The ref value 'timeoutsRef.current' will likely have changed by the time this effect cleanup function runs. If this ref points to a node rendered by React, copy 'timeoutsRef.current' to a variable inside the effect, and use that variable in the cleanup function  react-hooks/exhaustive-deps
  107:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                                                                                      react-refresh/only-export-components
  116:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                                                                                      react-refresh/only-export-components
  127:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                                                                                      react-refresh/only-export-components
  127:45  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                                                                                      @typescript-eslint/no-explicit-any
  127:56  warning  Unexpected any. Specify a different type                                       
                                                                                                  
                                                                                      @typescript-eslint/no-explicit-any
  135:19  warning  React Hook useCallback received a function whose dependencies are unknown. Pass an inline function instead                                                                       
                                                                                      react-hooks/exhaustive-deps
  164:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                                                                                      react-refresh/only-export-components

D:\sadhanaboard\src\hooks\useLogStream.ts
   7:28   warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
  20:20   warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
  23:23   warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
  27:62   error    Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions
  28:47   warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
  28:63   error    Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions
  39:147  warning  Unexpected any. Specify a different type                               @typescript-eslint/no-explicit-any
  44:67   error    Expected an assignment or function call and instead saw an expression  @typescript-eslint/no-unused-expressions

D:\sadhanaboard\src\hooks\useMobileAccessibility.tsx
    5:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                  react-refresh/only-export-components
   26:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                  react-refresh/only-export-components
   33:31  error    Unnecessary escape character: \"                                               
                                                                                                  
                  no-useless-escape
   33:35  error    Unnecessary escape character: \"                                               
                                                                                                  
                  no-useless-escape
  140:5   error    Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                   
                  jsx-a11y/click-events-have-key-events
  140:5   error    Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions
  172:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                  react-refresh/only-export-components
  196:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                  react-refresh/only-export-components
  379:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                  react-refresh/only-export-components
  383:50  error    Unnecessary escape character: \"                                               
                                                                                                  
                  no-useless-escape
  383:58  error    Unnecessary escape character: \"                                               
                                                                                                  
                  no-useless-escape
  383:69  error    Unnecessary escape character: \"                                               
                                                                                                  
                  no-useless-escape
  383:75  error    Unnecessary escape character: \"                                               
                                                                                                  
                  no-useless-escape
  448:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
                  react-refresh/only-export-components

D:\sadhanaboard\src\hooks\useMobilePerformance.tsx
    5:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components
  132:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components
  147:41  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any
  223:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components
  240:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components
  243:19  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any
  251:23  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any
  258:23  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any
  259:21  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any
  265:25  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any
  266:23  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any
  375:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components
  382:21  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any
  382:54  warning  Unexpected any. Specify a different type                                       
                                                 @typescript-eslint/no-explicit-any

D:\sadhanaboard\src\hooks\useOnboarding.ts
   51:59  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  136:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  167:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\hooks\useRealTimeDashboard.ts
  15:23  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\hooks\useRealTimeLibrary.ts
  4:57  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     
  5:28  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\hooks\useRealTimeUsers.ts
  4:55  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     
  5:28  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\hooks\useRetry.tsx
   35:17  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
          react-refresh/only-export-components
   36:9   warning  The 'finalConfig' object makes the dependencies of useCallback Hook (at line 143) change on every render. To fix this, wrap the initialization of 'finalConfig' in its own useMemo() Hook  react-hooks/exhaustive-deps
  224:21  warning  Unexpected any. Specify a different type                                       
                                                                                                  
          @typescript-eslint/no-explicit-any
  269:12  warning  Unexpected any. Specify a different type                                       
                                                                                                  
          @typescript-eslint/no-explicit-any
  284:12  warning  Unexpected any. Specify a different type                                       
                                                                                                  
          @typescript-eslint/no-explicit-any
  408:10  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
          react-refresh/only-export-components
  408:32  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components                                                   
          react-refresh/only-export-components

D:\sadhanaboard\src\hooks\useSaadhanas.ts
  139:51  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\hooks\useSadhanaData.ts
  68:55  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  97:55  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\hooks\useScrollTexture.ts
  34:6  warning  React Hook useEffect has a missing dependency: 'texture'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\hooks\useSettings.ts
   62:54  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  134:61  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  143:20  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\hooks\useSpiritualBooks.ts
  21:60  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\hooks\useSystemMonitoring.ts
    7:42  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   15:28  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   79:23  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   82:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
   85:17  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  122:43  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  136:55  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\hooks\useTouchGestures.ts
  167:6  warning  React Hook useEffect has a missing dependency: 'clearLongPressTimer'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\hooks\useUserAnalytics.ts
   9:56  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  10:58  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  11:42  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  12:50  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  13:42  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  14:60  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  16:38  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\hooks\useUserProfile.ts
  26:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  50:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\hooks\useUserProgression.ts
  71:6  warning  React Hook useEffect has a missing dependency: 'loadProgressionData'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\lib\api.ts
  15:36  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  36:34  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  66:34  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  96:31  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\lib\auth-context.tsx
  20:14  warning  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components
  69:6   warning  React Hook useEffect has a missing dependency: 'checkOnboardingStatus'. Either include it or remove the dependency array        react-hooks/exhaustive-deps

D:\sadhanaboard\src\lib\filterPresets.test.ts
  64:33  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\pages\landing\ExperimentPage.tsx
  146:6  warning  React Hook useEffect has a missing dependency: 'testimonials.length'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\pages\landing\LoginPage.tsx
  64:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\pages\landing\SignupPage.tsx
  67:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\pages\landing\WaitlistPage.tsx
  59:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\pages\user\AnalyticsPage.tsx
  25:6  warning  React Hook useEffect has missing dependencies: 'fetchCategoryInsights', 'fetchComparative', 'fetchCompletionRates', 'fetchHeatmap', 'fetchPracticeTrends', and 'fetchStreaks'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\pages\user\CommunityFeedPage.tsx
  8:38  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\pages\user\ProfilePage.tsx
  202:6  warning  React Hook useEffect has a missing dependency: 'fetchProfile'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\sadhanaboard\src\pages\user\SharedSadhanaDetailPage.tsx
  9:36  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\pages\user\SpiritualDemoPage.tsx
  77:45  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\pages\user\ThemePreviewPage.tsx
  19:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  19:39  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    
  19:75  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\services\analyticsApi.ts
  7:72  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any     

D:\sadhanaboard\src\services\bookApi.ts
   7:72   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  23:93   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  29:113  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  35:79   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   
  42:99   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\test-tara-import.tsx
  28:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any    

D:\sadhanaboard\src\themes\cosmos\CosmicBackground.tsx
  446:18  warning  The ref value 'mountRef.current' will likely have changed by the time this effect cleanup function runs. If this ref points to a node rendered by React, copy 'mountRef.current' to a variable inside the effect, and use that variable in the cleanup function  react-hooks/exhaustive-deps

D:\sadhanaboard\src\types\books.ts
  215:14  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any   

D:\sadhanaboard\src\utils\performanceMonitor.ts
  86:8  warning  React Hook useEffect has missing dependencies: 'id' and 'monitor'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

✖ 341 problems (76 errors, 265 warnings)
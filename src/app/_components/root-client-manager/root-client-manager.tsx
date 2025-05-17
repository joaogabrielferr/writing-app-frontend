'use client';

import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import splashStyles from '@/styles/SplashScreen.module.scss';

export default function RootPageClientManager() {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      // Still loading auth state, splash is visible by default
      return;
    }

    // Auth check is complete
    const splashScreen = document.getElementById('splash-screen-overlay');
    const landingPage = document.getElementById('landing-page-content');

    if (isAuthenticated) {
      // User is authenticated, prepare to redirect.
      // Keep splash visible or ensure landing page isn't shown until redirect happens.
      // Then redirect.
      router.replace('/feed');
      // It's important that the splash screen is only hidden AFTER the redirect starts
      // or that the landing page is never shown to an authenticated user on this path.
      // To ensure no flicker, the splash screen should ideally remain until /feed starts rendering
      // OR we simply never unhide the landing page if redirecting.

      // If router.replace is fast enough, hiding splash here might be okay, but it's a race.
      // A safer bet is to ensure the landing page itself is not made visible.
      if (splashScreen) {
        // splashScreen.classList.add(splashStyles.hidden); // or .style.display = 'none'
        // We might want to delay hiding the splash until the new route is visually ready,
        // but that's more complex. For now, the main goal is to not show landing page.
      }

    } else {
      // User is NOT authenticated. Hide splash and show landing page.
      if (splashScreen) {
        // splashScreen.classList.add(splashStyles.hidden); // Or .style.display = 'none'
        splashScreen.style.display = 'none';
        landingPage!.style.display = 'block';
      }
      // The LandingPageContent is already in the DOM, it was just overlaid.
      // No need to explicitly set its display to 'block' if its default display
      // (once splash is gone) is what you want.
      // If LandingPageContent had display:none initially via SCSS, you'd show it here:
      // const landingPage = document.getElementById('landing-page-content');
      // if (landingPage) {
      //   landingPage.style.display = 'flex'; // or 'block', depending on its layout
      // }
    }
  }, [isLoading, isAuthenticated, router]);

  return null;
}
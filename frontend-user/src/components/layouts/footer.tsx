import type { Dictionary } from '@/types/i18n'

type FooterProps = {
  dictionary: Dictionary
}

export function Footer({ dictionary }: FooterProps) {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {/*<h3 className="font-bold mb-4">About</h3>*/}
            {/*<p className="text-sm text-gray-600">*/}
            {/*  ブログの説明文がここに入ります。*/}
            {/*</p>*/}
          </div>
          <div>
          {/*  <h3 className="font-bold mb-4">カテゴリー</h3>*/}
          {/*  <ul className="space-y-2">*/}
          {/*    <li>*/}
          {/*      <a*/}
          {/*        href="#"*/}
          {/*        className="text-sm text-gray-600 hover:text-gray-900"*/}
          {/*      >*/}
          {/*        プログラミング*/}
          {/*      </a>*/}
          {/*    </li>*/}
          {/*    <li>*/}
          {/*      <a*/}
          {/*        href="#"*/}
          {/*        className="text-sm text-gray-600 hover:text-gray-900"*/}
          {/*      >*/}
          {/*        インフラ*/}
          {/*      </a>*/}
          {/*    </li>*/}
          {/*    <li>*/}
          {/*      <a*/}
          {/*        href="#"*/}
          {/*        className="text-sm text-gray-600 hover:text-gray-900"*/}
          {/*      >*/}
          {/*        デザイン*/}
          {/*      </a>*/}
          {/*    </li>*/}
          {/*  </ul>*/}
          </div>
          <div>
            <h3 className="font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              {/*<li>*/}
              {/*  <a*/}
              {/*    href="#"*/}
              {/*    className="text-sm text-gray-600 hover:text-gray-900"*/}
              {/*  >*/}
              {/*    プライバシーポリシー*/}
              {/*  </a>*/}
              {/*</li>*/}
              {/*<li>*/}
              {/*  <a*/}
              {/*    href="#"*/}
              {/*    className="text-sm text-gray-600 hover:text-gray-900"*/}
              {/*  >*/}
              {/*    利用規約*/}
              {/*  </a>*/}
              {/*</li>*/}
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {dictionary.footer.contactUs}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/*<div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">*/}
        {/*  © 2024 ブログ. All rights reserved.*/}
        {/*</div>*/}
      </div>
    </footer>
  )
}

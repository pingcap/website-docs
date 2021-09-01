import '../styles/pages/tools.scss'

import {
  Card,
  CardContent,
  CardHeader,
  CardHeaderIcon,
  CardHeaderTitle,
  Column,
  Columns,
  Content,
} from '@seagreenio/react-bulma'
import { FormattedMessage, Link } from 'gatsby-plugin-react-intl'

import React from 'react'
import Seo from 'components/seo'
import { toolsData } from 'data/tools'

const Tools = () => (
  <>
    <Seo title="Tools" />
    <div className="PingCAP-Tools">
      <Columns multiline>
        {toolsData.map((tool) => (
          <Column key={tool.icon} size={6}>
            <Link to={tool.link}>
              <Card>
                <CardHeader>
                  <CardHeaderTitle>
                    <FormattedMessage id={tool.type} />
                  </CardHeaderTitle>
                  <CardHeaderIcon className={`tool-icon ${tool.icon}`} />
                </CardHeader>
                <CardContent>
                  <Content>
                    <FormattedMessage id={tool.desc} />
                  </Content>
                </CardContent>
              </Card>
            </Link>
          </Column>
        ))}
      </Columns>
    </div>
  </>
)

export default Tools

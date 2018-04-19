<?php
/**
 * This file is part of the ZBateson\MailMimeParser project.
 *
 * @license http://opensource.org/licenses/bsd-license.php BSD
 */
namespace ZBateson\MailMimeParser\Header\Part;

include_once(__DIR__ . "/Token.php");
include_once(__DIR__ . "/AddressGroupPart.php");
include_once(__DIR__ . "/AddressPart.php");
include_once(__DIR__ . "/CommentPart.php");
include_once(__DIR__ . "/DatePart.php");
include_once(__DIR__ . "/HeaderPart.php");
include_once(__DIR__ . "/LiteralPart.php");
include_once(__DIR__ . "/ParameterPart.php");

/**
 * Holds a single address or name/address pair.
 * 
 * The name part of the address may be mime-encoded, but the email address part
 * can't be mime-encoded.  Any whitespace in the email address part is stripped
 * out.
 *
 * A convenience method, getEmail, is provided for clarity -- but getValue
 * returns the email address as well.
 * 
 * @author Zaahid Bateson
 */
class AddressPart extends ParameterPart
{
    /**
     * Performs mime-decoding and initializes the address' name and email.
     * 
     * The passed $name may be mime-encoded.  $email is stripped of any
     * whitespace.
     * 
     * @param string $name
     * @param string $email
     */
    public function __construct($name, $email)
    {
        parent::__construct(
            $name,
            ''
        );
        // can't be mime-encoded
        $this->value = $this->convertEncoding(preg_replace('/\s+/', '', $email));
    }
    
    /**
     * Returns the email address.
     * 
     * @return string
     */
    public function getEmail()
    {
        return $this->value;
    }
}
